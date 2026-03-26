import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createHash } from 'crypto';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../services/auth.service';
import { AuthCredentialRepository } from '../repositories/auth-credential.repository';
import { AuthSessionRepository } from '../repositories/auth-session.repository';
import { PasswordResetRepository } from '../repositories/password-reset.repository';
import { TokenFactory } from '../factories/token.factory';
import { EmailPort } from '../../../infrastructure/adapters/email/email.port';
import { DOMAIN_EVENTS, ERROR_CODES } from '../../../common/constants';
import { DomainError } from '../../../common/errors';
import type { AuthUser } from '../domain/auth-user';

// ── Fixtures ─────────────────────────────────────────────

function buildAuthUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
    role: 'MEMBER',
    accountStatus: 'ACTIVE',
    passwordHash: '$2b$12$hashedpassword',
    emailVerifiedAt: null,
    failedLoginCount: 0,
    lockedUntil: null,
    createdAt: new Date('2025-01-01'),
    ...overrides,
  };
}

function buildTokenPair() {
  return {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    refreshTokenExpiresAt: new Date(Date.now() + 86400000),
  };
}

function buildSession(overrides = {}) {
  return {
    id: 'session-1',
    userId: 'user-1',
    refreshToken: 'refresh-token',
    deviceName: null,
    ipAddress: null,
    expiresAt: new Date(Date.now() + 86400000),
    revokedAt: null,
    createdAt: new Date(),
    ...overrides,
  };
}

function buildResetToken(overrides = {}) {
  return {
    id: 'reset-1',
    userId: 'user-1',
    tokenHash: 'somehash',
    expiresAt: new Date(Date.now() + 3600000),
    usedAt: null,
    createdAt: new Date(),
    ...overrides,
  };
}

// ── Test suite ───────────────────────────────────────────

describe('AuthService', () => {
  let service: AuthService;
  let credentialRepo: jest.Mocked<AuthCredentialRepository>;
  let sessionRepo: jest.Mocked<AuthSessionRepository>;
  let resetRepo: jest.Mocked<PasswordResetRepository>;
  let tokenFactory: jest.Mocked<TokenFactory>;
  let emailPort: jest.Mocked<EmailPort>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthCredentialRepository,
          useValue: {
            findUserByEmail: jest.fn(),
            findUserByUsername: jest.fn(),
            findUserById: jest.fn(),
            createUserWithCredentials: jest.fn(),
            updatePasswordHash: jest.fn(),
            incrementFailedLogins: jest.fn(),
            resetFailedLogins: jest.fn(),
            lockAccount: jest.fn(),
          },
        },
        {
          provide: AuthSessionRepository,
          useValue: {
            create: jest.fn(),
            findActiveByToken: jest.fn(),
            revokeById: jest.fn(),
            revokeAllForUser: jest.fn(),
          },
        },
        {
          provide: PasswordResetRepository,
          useValue: {
            create: jest.fn(),
            findValidByHash: jest.fn(),
            markAsUsed: jest.fn(),
            invalidateAllForUser: jest.fn(),
          },
        },
        {
          provide: TokenFactory,
          useValue: { createTokenPair: jest.fn() },
        },
        {
          provide: EmailPort,
          useValue: { send: jest.fn() },
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    credentialRepo = module.get(AuthCredentialRepository);
    sessionRepo = module.get(AuthSessionRepository);
    resetRepo = module.get(PasswordResetRepository);
    tokenFactory = module.get(TokenFactory);
    emailPort = module.get(EmailPort);
    eventEmitter = module.get(EventEmitter2);
  });

  // ── Register ─────────────────────────────────────────

  describe('register', () => {
    const dto = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'Password1',
    };

    beforeEach(() => {
      credentialRepo.findUserByEmail.mockResolvedValue(null);
      credentialRepo.findUserByUsername.mockResolvedValue(null);
      credentialRepo.createUserWithCredentials.mockResolvedValue(
        buildAuthUser({
          username: 'newuser',
          email: 'new@example.com',
        }),
      );
      tokenFactory.createTokenPair.mockResolvedValue(buildTokenPair());
      sessionRepo.create.mockResolvedValue(buildSession());
    });

    it('should create user and return tokens', async () => {
      const result = await service.register(dto);

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(result.user.email).toBe('new@example.com');
      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('should emit USER_REGISTERED event', async () => {
      await service.register(dto);

      expect(eventEmitter.emit).toHaveBeenCalledWith(
        DOMAIN_EVENTS.USER_REGISTERED,
        expect.objectContaining({ userId: 'user-1' }),
      );
    });

    it('should reject duplicate email', async () => {
      credentialRepo.findUserByEmail.mockResolvedValue(buildAuthUser());

      await expect(service.register(dto)).rejects.toThrow(
        'Email already registered',
      );
    });

    it('should reject duplicate username', async () => {
      credentialRepo.findUserByUsername.mockResolvedValue(buildAuthUser());

      await expect(service.register(dto)).rejects.toThrow(
        'Username already taken',
      );
    });

    it('should hash the password before storing', async () => {
      await service.register(dto);

      const call = credentialRepo.createUserWithCredentials.mock.calls[0][0];
      expect(call.passwordHash).not.toBe('Password1');
      expect(call.passwordHash).toMatch(/^\$2[aby]\$/);
    });
  });

  // ── Login ────────────────────────────────────────────

  describe('login', () => {
    const dto = { email: 'test@example.com', password: 'Password1' };

    it('should return tokens on valid credentials', async () => {
      const hashed = await bcrypt.hash('Password1', 4);
      credentialRepo.findUserByEmail.mockResolvedValue(
        buildAuthUser({ passwordHash: hashed }),
      );
      tokenFactory.createTokenPair.mockResolvedValue(buildTokenPair());
      sessionRepo.create.mockResolvedValue(buildSession());

      const result = await service.login(dto);

      expect(result.accessToken).toBe('access-token');
      expect(credentialRepo.resetFailedLogins).toHaveBeenCalledWith('user-1');
    });

    it('should throw on non-existent email', async () => {
      credentialRepo.findUserByEmail.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(
        'Invalid email or password',
      );
    });

    it('should throw on wrong password', async () => {
      const hashed = await bcrypt.hash('DifferentPass1', 4);
      credentialRepo.findUserByEmail.mockResolvedValue(
        buildAuthUser({ passwordHash: hashed }),
      );

      await expect(service.login(dto)).rejects.toThrow(
        'Invalid email or password',
      );
    });

    it('should throw for suspended account', async () => {
      credentialRepo.findUserByEmail.mockResolvedValue(
        buildAuthUser({ accountStatus: 'SUSPENDED' }),
      );

      await expect(service.login(dto)).rejects.toThrow('Account is suspended');
    });

    it('should throw for locked account', async () => {
      const future = new Date(Date.now() + 600000);
      credentialRepo.findUserByEmail.mockResolvedValue(
        buildAuthUser({ lockedUntil: future }),
      );

      await expect(service.login(dto)).rejects.toThrow(
        'Account is temporarily locked',
      );
    });

    it('should allow login if lockout has expired', async () => {
      const past = new Date(Date.now() - 600000);
      const hashed = await bcrypt.hash('Password1', 4);
      credentialRepo.findUserByEmail.mockResolvedValue(
        buildAuthUser({ lockedUntil: past, passwordHash: hashed }),
      );
      tokenFactory.createTokenPair.mockResolvedValue(buildTokenPair());
      sessionRepo.create.mockResolvedValue(buildSession());

      const result = await service.login(dto);
      expect(result.accessToken).toBeDefined();
    });

    it('should increment failed login count on wrong password', async () => {
      const hashed = await bcrypt.hash('CorrectPass1', 4);
      credentialRepo.findUserByEmail.mockResolvedValue(
        buildAuthUser({ passwordHash: hashed, failedLoginCount: 0 }),
      );

      await expect(service.login(dto)).rejects.toThrow();
      expect(credentialRepo.incrementFailedLogins).toHaveBeenCalledWith(
        'user-1',
      );
    });

    it('should lock account after max failed attempts', async () => {
      const hashed = await bcrypt.hash('CorrectPass1', 4);
      credentialRepo.findUserByEmail.mockResolvedValue(
        buildAuthUser({ passwordHash: hashed, failedLoginCount: 4 }),
      );

      await expect(service.login(dto)).rejects.toThrow();
      expect(credentialRepo.lockAccount).toHaveBeenCalledWith(
        'user-1',
        expect.any(Date),
      );
    });

    it('should throw when user has no password hash (OAuth-only user)', async () => {
      credentialRepo.findUserByEmail.mockResolvedValue(
        buildAuthUser({ passwordHash: null }),
      );

      await expect(service.login(dto)).rejects.toThrow(
        'Invalid email or password',
      );
    });
  });

  // ── Get Current User ─────────────────────────────────

  describe('getCurrentUser', () => {
    it('should return user profile without sensitive fields', async () => {
      credentialRepo.findUserById.mockResolvedValue(buildAuthUser());

      const result = await service.getCurrentUser('user-1');

      expect(result.id).toBe('user-1');
      expect(result.username).toBe('testuser');
      expect(result.role).toBe('MEMBER');
      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('failedLoginCount');
      expect(result).not.toHaveProperty('lockedUntil');
    });

    it('should throw if user not found', async () => {
      credentialRepo.findUserById.mockResolvedValue(null);

      await expect(service.getCurrentUser('missing')).rejects.toThrow(
        'User not found',
      );
    });
  });

  // ── Request Password Reset ───────────────────────────

  describe('requestPasswordReset', () => {
    it('should send email when user exists', async () => {
      credentialRepo.findUserByEmail.mockResolvedValue(buildAuthUser());
      resetRepo.create.mockResolvedValue(buildResetToken());

      await service.requestPasswordReset('test@example.com');

      expect(resetRepo.invalidateAllForUser).toHaveBeenCalledWith('user-1');
      expect(resetRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user-1' }),
      );
      expect(emailPort.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: 'Password Reset Request',
        }),
      );
    });

    it('should not throw when email does not exist (prevents enumeration)', async () => {
      credentialRepo.findUserByEmail.mockResolvedValue(null);

      await expect(
        service.requestPasswordReset('nonexistent@example.com'),
      ).resolves.not.toThrow();

      expect(emailPort.send).not.toHaveBeenCalled();
    });

    it('should not send email for suspended accounts', async () => {
      credentialRepo.findUserByEmail.mockResolvedValue(
        buildAuthUser({ accountStatus: 'SUSPENDED' }),
      );

      await service.requestPasswordReset('test@example.com');

      expect(emailPort.send).not.toHaveBeenCalled();
    });

    it('should invalidate previous tokens before creating new one', async () => {
      credentialRepo.findUserByEmail.mockResolvedValue(buildAuthUser());
      resetRepo.create.mockResolvedValue(buildResetToken());

      await service.requestPasswordReset('test@example.com');

      const invalidateOrder =
        resetRepo.invalidateAllForUser.mock.invocationCallOrder[0];
      const createOrder = resetRepo.create.mock.invocationCallOrder[0];
      expect(invalidateOrder).toBeLessThan(createOrder);
    });

    it('should emit PASSWORD_RESET_REQUESTED event', async () => {
      credentialRepo.findUserByEmail.mockResolvedValue(buildAuthUser());
      resetRepo.create.mockResolvedValue(buildResetToken());

      await service.requestPasswordReset('test@example.com');

      expect(eventEmitter.emit).toHaveBeenCalledWith(
        DOMAIN_EVENTS.PASSWORD_RESET_REQUESTED,
        expect.objectContaining({ userId: 'user-1' }),
      );
    });
  });

  // ── Reset Password ───────────────────────────────────

  describe('resetPassword', () => {
    const dto = { token: 'raw-token-value', newPassword: 'NewPassword1' };

    it('should update password, revoke sessions, and mark token used', async () => {
      const tokenHash = createHash('sha256')
        .update('raw-token-value')
        .digest('hex');
      resetRepo.findValidByHash.mockResolvedValue(
        buildResetToken({ tokenHash }),
      );

      await service.resetPassword(dto);

      expect(credentialRepo.updatePasswordHash).toHaveBeenCalledWith(
        'user-1',
        expect.stringMatching(/^\$2[aby]\$/),
      );
      expect(resetRepo.markAsUsed).toHaveBeenCalledWith('reset-1');
      expect(sessionRepo.revokeAllForUser).toHaveBeenCalledWith('user-1');
      expect(credentialRepo.resetFailedLogins).toHaveBeenCalledWith('user-1');
    });

    it('should throw on invalid token', async () => {
      resetRepo.findValidByHash.mockResolvedValue(null);

      await expect(service.resetPassword(dto)).rejects.toThrow(
        'Invalid or expired reset token',
      );
    });

    it('should emit PASSWORD_RESET_COMPLETED event', async () => {
      const tokenHash = createHash('sha256')
        .update('raw-token-value')
        .digest('hex');
      resetRepo.findValidByHash.mockResolvedValue(
        buildResetToken({ tokenHash }),
      );

      await service.resetPassword(dto);

      expect(eventEmitter.emit).toHaveBeenCalledWith(
        DOMAIN_EVENTS.PASSWORD_RESET_COMPLETED,
        expect.objectContaining({ userId: 'user-1' }),
      );
    });

    it('should hash the token before looking it up', async () => {
      resetRepo.findValidByHash.mockResolvedValue(null);

      try {
        await service.resetPassword(dto);
      } catch {
        // expected
      }

      const calledHash = resetRepo.findValidByHash.mock.calls[0][0];
      const expectedHash = createHash('sha256')
        .update('raw-token-value')
        .digest('hex');
      expect(calledHash).toBe(expectedHash);
    });
  });

  // ── Refresh Tokens ───────────────────────────────────

  describe('refreshTokens', () => {
    it('should revoke old session and issue new tokens', async () => {
      sessionRepo.findActiveByToken.mockResolvedValue(buildSession());
      credentialRepo.findUserById.mockResolvedValue(buildAuthUser());
      tokenFactory.createTokenPair.mockResolvedValue(buildTokenPair());
      sessionRepo.create.mockResolvedValue(buildSession());

      const result = await service.refreshTokens('refresh-token');

      expect(sessionRepo.revokeById).toHaveBeenCalledWith('session-1');
      expect(result.accessToken).toBe('access-token');
    });

    it('should throw on invalid refresh token', async () => {
      sessionRepo.findActiveByToken.mockResolvedValue(null);

      await expect(service.refreshTokens('bad-token')).rejects.toThrow(
        'Invalid or expired refresh token',
      );
    });

    it('should throw if user no longer exists', async () => {
      sessionRepo.findActiveByToken.mockResolvedValue(buildSession());
      credentialRepo.findUserById.mockResolvedValue(null);

      await expect(service.refreshTokens('refresh-token')).rejects.toThrow(
        'User not found',
      );
    });
  });

  // ── Logout ───────────────────────────────────────────

  describe('logout', () => {
    it('should revoke the session if found', async () => {
      sessionRepo.findActiveByToken.mockResolvedValue(buildSession());

      await service.logout('token');

      expect(sessionRepo.revokeById).toHaveBeenCalledWith('session-1');
    });

    it('should do nothing if session not found', async () => {
      sessionRepo.findActiveByToken.mockResolvedValue(null);

      await expect(service.logout('bad-token')).resolves.not.toThrow();
      expect(sessionRepo.revokeById).not.toHaveBeenCalled();
    });
  });

  // ── Logout All ───────────────────────────────────────

  describe('logoutAll', () => {
    it('should revoke all sessions for user', async () => {
      await service.logoutAll('user-1');

      expect(sessionRepo.revokeAllForUser).toHaveBeenCalledWith('user-1');
    });
  });
});
