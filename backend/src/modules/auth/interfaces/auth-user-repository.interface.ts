import type { AuthUser } from '../domain/auth-user';

/** Input for creating a new user with email credentials. */
export interface CreateUserWithCredentialsData {
  username: string;
  email: string;
  passwordHash: string;
}

/**
 * Contract for user identity and credential data access.
 * Implementations handle Prisma, the mapper, and the User+AuthCredential join.
 * Services depend on this interface, never on the concrete repository.
 */
export interface IAuthUserRepository {
  /** Find a user by email address, including email credential data. */
  findUserByEmail(email: string): Promise<AuthUser | null>;

  /** Find a user by username, including email credential data. */
  findUserByUsername(username: string): Promise<AuthUser | null>;

  /** Find a user by ID, including email credential data. */
  findUserById(userId: string): Promise<AuthUser | null>;

  /** Create a new user with an EMAIL provider credential in a single operation. */
  createUserWithCredentials(
    data: CreateUserWithCredentialsData,
  ): Promise<AuthUser>;

  /** Replace the password hash on a user's EMAIL credential. */
  updatePasswordHash(userId: string, passwordHash: string): Promise<void>;

  /** Increment the failed login counter by one. */
  incrementFailedLogins(userId: string): Promise<void>;

  /** Reset failed login counter to zero and clear any lockout timestamp. */
  resetFailedLogins(userId: string): Promise<void>;

  /** Lock the account until a given timestamp after too many failed attempts. */
  lockAccount(userId: string, lockedUntil: Date): Promise<void>;
}

/** DI token for IAuthUserRepository. */
export const AUTH_USER_REPOSITORY = Symbol('AUTH_USER_REPOSITORY');
