/** JWT payload embedded in access tokens. */
export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: string;
}

/** Token pair returned after successful authentication. */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

/** Result of generating a password reset token. */
export interface ResetTokenResult {
  rawToken: string;
  tokenHash: string;
  expiresAt: Date;
}

/**
 * Adapter interface for token generation.
 * Wraps JWT signing, opaque refresh token creation, and reset token generation.
 * Decouples the service from specific crypto/JWT implementations.
 */
export interface ITokenProvider {
  /** Create a JWT access token and an opaque refresh token for a user. */
  createTokenPair(payload: AccessTokenPayload): Promise<TokenPair>;

  /** Generate a cryptographically secure reset token with its SHA-256 hash and expiry. */
  generateResetToken(): ResetTokenResult;
}

/** DI token for ITokenProvider. */
export const TOKEN_PROVIDER = Symbol('TOKEN_PROVIDER');
