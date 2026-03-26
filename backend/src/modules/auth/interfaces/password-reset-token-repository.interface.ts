import type { PasswordResetTokenDomain } from '../domain/password-reset-token';

/** Input for creating a new password reset token record. */
export interface CreateResetTokenData {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

/**
 * Contract for password reset token data access.
 * Only the hashed token is stored; the raw token is sent to the user via email.
 */
export interface IPasswordResetTokenRepository {
  /** Persist a new hashed reset token with expiry. */
  create(data: CreateResetTokenData): Promise<PasswordResetTokenDomain>;

  /** Find a token by hash that has not been used and has not expired. */
  findValidByHash(tokenHash: string): Promise<PasswordResetTokenDomain | null>;

  /** Mark a single token as used by setting its usedAt timestamp. */
  markAsUsed(tokenId: string): Promise<void>;

  /** Invalidate all unused tokens for a user (called before issuing a new one). */
  invalidateAllForUser(userId: string): Promise<void>;
}

/** DI token for IPasswordResetTokenRepository. */
export const PASSWORD_RESET_TOKEN_REPOSITORY = Symbol(
  'PASSWORD_RESET_TOKEN_REPOSITORY',
);
