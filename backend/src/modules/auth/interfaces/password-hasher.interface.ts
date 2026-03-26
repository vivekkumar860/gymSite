/**
 * Adapter interface for password hashing.
 * Decouples the service layer from any specific hashing library (bcrypt, argon2, scrypt).
 * Unit tests inject a fake that returns deterministic values without real crypto overhead.
 */
export interface IPasswordHasher {
  /** Hash a plaintext password. Returns the hash string (includes algorithm+salt+cost metadata). */
  hash(plaintext: string): Promise<string>;

  /** Compare a plaintext password against a stored hash. */
  verify(plaintext: string, hash: string): Promise<boolean>;
}

/** DI token for IPasswordHasher. */
export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');
