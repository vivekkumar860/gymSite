import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createHash, randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { AuthCredentialRepository } from '../repositories/auth-credential.repository';
import { AuthSessionRepository } from '../repositories/auth-session.repository';
import { PasswordResetRepository } from '../repositories/password-reset.repository';
import { TokenFactory, TokenPair } from '../factories/token.factory';
import { AuthUserMapper } from '../mappers/auth-user.mapper';
import { UserRegisteredEvent } from '../events/user-registered.event';
import { EmailPort } from '../../../infrastructure/adapters/email/email.port';
import { DomainError } from '../../../common/errors';
import { DOMAIN_EVENTS, ERROR_CODES } from '../../../common/constants';
import {
  BCRYPT_SALT_ROUNDS,
  MAX_FAILED_LOGIN_ATTEMPTS,
  ACCOUNT_LOCKOUT_MINUTES,
  PASSWORD_RESET_TOKEN_EXPIRY_MINUTES,
} from '../../../common/constants';
import type { RegisterDto } from '../dto/register.dto';
import type { LoginDto } from '../dto/login.dto';
import type { ResetPasswordDto } from '../dto/reset-password.dto';
import type { AuthResponseDto } from '../dto/auth-response.dto';
import type { CurrentUserResponseDto } from '../dto/current-user-response.dto';
import type { AuthUser } from '../domain/auth-user';

/** Handles registration, login, password reset, token refresh, and user retrieval. */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly credentialRepo: AuthCredentialRepository,
    private readonly sessionRepo: AuthSessionRepository,
    private readonly resetRepo: PasswordResetRepository,
    private readonly tokenFactory: TokenFactory,
    private readonly emailPort: EmailPort,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /** Register a new user with email and password. */
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    await this.ensureEmailNotTaken(dto.email);
    await this.ensureUsernameNotTaken(dto.username);

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

    const user = await this.credentialRepo.createUserWithCredentials({
      username: dto.username,
      email: dto.email,
      passwordHash,
    });

    const tokens = await this.createSessionForUser(user);

    this.eventEmitter.emit(
      DOMAIN_EVENTS.USER_REGISTERED,
      new UserRegisteredEvent(user.id, user.username, user.email),
    );

    return this.buildAuthResponse(user, tokens);
  }

  /** Authenticate a user with email and password. */
  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.credentialRepo.findUserByEmail(dto.email);

    if (!user) {
      throw new DomainError(
        ERROR_CODES.AUTH_INVALID_CREDENTIALS,
        'Invalid email or password',
        401,
      );
    }

    this.ensureAccountNotSuspended(user);
    this.ensureAccountNotLocked(user);
    await this.verifyPassword(user, dto.password);
    await this.credentialRepo.resetFailedLogins(user.id);

    const tokens = await this.createSessionForUser(user);

    return this.buildAuthResponse(user, tokens);
  }

  /** Get the currently authenticated user's profile. */
  async getCurrentUser(userId: string): Promise<CurrentUserResponseDto> {
    const user = await this.credentialRepo.findUserById(userId);

    if (!user) {
      throw new DomainError(
        ERROR_CODES.RESOURCE_NOT_FOUND,
        'User not found',
        404,
      );
    }

    return AuthUserMapper.toCurrentUserResponse(user);
  }

  /** Generate a password reset token and send it via email. */
  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.credentialRepo.findUserByEmail(email);

    if (!user) {
      this.logger.debug('Password reset requested for non-existent email');
      return;
    }

    if (user.accountStatus === 'SUSPENDED') {
      this.logger.debug('Password reset requested for suspended account');
      return;
    }

    await this.resetRepo.invalidateAllForUser(user.id);

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = this.calculateResetTokenExpiry();

    await this.resetRepo.create({ userId: user.id, tokenHash, expiresAt });

    await this.emailPort.send({
      to: user.email,
      subject: 'Password Reset Request',
      html: this.buildResetEmailHtml(rawToken),
    });

    this.eventEmitter.emit(DOMAIN_EVENTS.PASSWORD_RESET_REQUESTED, {
      userId: user.id,
    });
  }

  /** Validate a reset token and set a new password. */
  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const tokenHash = this.hashToken(dto.token);
    const resetToken = await this.resetRepo.findValidByHash(tokenHash);

    if (!resetToken) {
      throw new DomainError(
        ERROR_CODES.AUTH_RESET_TOKEN_INVALID,
        'Invalid or expired reset token',
        400,
      );
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_SALT_ROUNDS);

    await this.credentialRepo.updatePasswordHash(
      resetToken.userId,
      passwordHash,
    );
    await this.resetRepo.markAsUsed(resetToken.id);
    await this.sessionRepo.revokeAllForUser(resetToken.userId);
    await this.credentialRepo.resetFailedLogins(resetToken.userId);

    this.eventEmitter.emit(DOMAIN_EVENTS.PASSWORD_RESET_COMPLETED, {
      userId: resetToken.userId,
    });
  }

  /** Issue new tokens using a valid refresh token. */
  async refreshTokens(refreshToken: string): Promise<AuthResponseDto> {
    const session = await this.sessionRepo.findActiveByToken(refreshToken);

    if (!session) {
      throw new DomainError(
        ERROR_CODES.AUTH_SESSION_REVOKED,
        'Invalid or expired refresh token',
        401,
      );
    }

    await this.sessionRepo.revokeById(session.id);

    const user = await this.credentialRepo.findUserById(session.userId);
    if (!user) {
      throw new DomainError(
        ERROR_CODES.AUTH_INVALID_CREDENTIALS,
        'User not found',
        401,
      );
    }

    const tokens = await this.createSessionForUser(user);
    return this.buildAuthResponse(user, tokens);
  }

  /** Revoke a specific refresh token (logout from one device). */
  async logout(refreshToken: string): Promise<void> {
    const session = await this.sessionRepo.findActiveByToken(refreshToken);
    if (session) {
      await this.sessionRepo.revokeById(session.id);
    }
  }

  /** Revoke all sessions for a user (logout everywhere). */
  async logoutAll(userId: string): Promise<void> {
    await this.sessionRepo.revokeAllForUser(userId);
  }

  /** Deactivate the current user's account and revoke all sessions. */
  async deactivateAccount(userId: string): Promise<void> {
    await this.credentialRepo.deactivateUser(userId);
    await this.sessionRepo.revokeAllForUser(userId);
  }

  // ── Private helpers ──────────────────────────────────────────

  private async ensureEmailNotTaken(email: string): Promise<void> {
    const existing = await this.credentialRepo.findUserByEmail(email);
    if (existing) {
      throw new DomainError(
        ERROR_CODES.RESOURCE_CONFLICT,
        'Email already registered',
        409,
      );
    }
  }

  private async ensureUsernameNotTaken(username: string): Promise<void> {
    const existing = await this.credentialRepo.findUserByUsername(username);
    if (existing) {
      throw new DomainError(
        ERROR_CODES.RESOURCE_CONFLICT,
        'Username already taken',
        409,
      );
    }
  }

  private ensureAccountNotSuspended(user: AuthUser): void {
    if (user.accountStatus === 'SUSPENDED') {
      throw new DomainError(
        ERROR_CODES.AUTH_ACCOUNT_SUSPENDED,
        'Account is suspended',
        403,
      );
    }
    if (user.accountStatus === 'DEACTIVATED') {
      throw new DomainError(
        ERROR_CODES.AUTH_ACCOUNT_SUSPENDED,
        'Account has been deactivated',
        403,
      );
    }
  }

  private ensureAccountNotLocked(user: AuthUser): void {
    if (!user.lockedUntil) return;
    if (user.lockedUntil > new Date()) {
      throw new DomainError(
        ERROR_CODES.AUTH_ACCOUNT_LOCKED,
        'Account is temporarily locked',
        423,
      );
    }
  }

  private async verifyPassword(
    user: AuthUser,
    password: string,
  ): Promise<void> {
    if (!user.passwordHash) {
      throw new DomainError(
        ERROR_CODES.AUTH_INVALID_CREDENTIALS,
        'Invalid email or password',
        401,
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      await this.handleFailedLogin(user);
      throw new DomainError(
        ERROR_CODES.AUTH_INVALID_CREDENTIALS,
        'Invalid email or password',
        401,
      );
    }
  }

  private async handleFailedLogin(user: AuthUser): Promise<void> {
    const newCount = user.failedLoginCount + 1;

    if (newCount >= MAX_FAILED_LOGIN_ATTEMPTS) {
      const lockedUntil = new Date();
      lockedUntil.setMinutes(
        lockedUntil.getMinutes() + ACCOUNT_LOCKOUT_MINUTES,
      );
      await this.credentialRepo.lockAccount(user.id, lockedUntil);
      return;
    }

    await this.credentialRepo.incrementFailedLogins(user.id);
  }

  private async createSessionForUser(user: AuthUser): Promise<TokenPair> {
    const tokens = await this.tokenFactory.createTokenPair({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    await this.sessionRepo.create({
      userId: user.id,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.refreshTokenExpiresAt,
    });

    return tokens;
  }

  private buildAuthResponse(
    user: AuthUser,
    tokens: TokenPair,
  ): AuthResponseDto {
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private calculateResetTokenExpiry(): Date {
    const expiry = new Date();
    expiry.setMinutes(
      expiry.getMinutes() + PASSWORD_RESET_TOKEN_EXPIRY_MINUTES,
    );
    return expiry;
  }

  private buildResetEmailHtml(token: string): string {
    return [
      '<p>You requested a password reset.</p>',
      `<p>Your reset token: <strong>${token}</strong></p>`,
      `<p>This token expires in ${PASSWORD_RESET_TOKEN_EXPIRY_MINUTES} minutes.</p>`,
      '<p>If you did not request this, please ignore this email.</p>',
    ].join('');
  }
}
