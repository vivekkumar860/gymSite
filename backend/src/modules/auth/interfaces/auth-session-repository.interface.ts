import type { AuthSessionDomain } from '../domain/auth-session';

/** Input for creating a new refresh token session. */
export interface CreateSessionData {
  userId: string;
  refreshToken: string;
  expiresAt: Date;
  deviceName?: string;
  ipAddress?: string;
}

/**
 * Contract for refresh token session data access.
 * Manages session lifecycle: creation, lookup, single revocation, bulk revocation.
 */
export interface IAuthSessionRepository {
  /** Persist a new refresh token session. */
  create(data: CreateSessionData): Promise<AuthSessionDomain>;

  /** Find an active (non-revoked, non-expired) session by its refresh token value. */
  findActiveByToken(refreshToken: string): Promise<AuthSessionDomain | null>;

  /** Revoke a single session by its ID. */
  revokeById(sessionId: string): Promise<void>;

  /** Revoke all active sessions for a user (e.g., on password change or logout-all). */
  revokeAllForUser(userId: string): Promise<void>;
}

/** DI token for IAuthSessionRepository. */
export const AUTH_SESSION_REPOSITORY = Symbol('AUTH_SESSION_REPOSITORY');
