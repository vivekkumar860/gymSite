/** Auth-related numeric constants — no magic numbers. */

/** Maximum failed login attempts before account lockout. */
export const MAX_FAILED_LOGIN_ATTEMPTS = 5;

/** Account lockout duration in minutes after max failed attempts. */
export const ACCOUNT_LOCKOUT_MINUTES = 15;

/** Access token TTL in seconds (15 minutes). */
export const ACCESS_TOKEN_EXPIRY_SECONDS = 900;

/** Refresh token TTL in days. */
export const REFRESH_TOKEN_EXPIRY_DAYS = 30;

/** Minimum password length. */
export const MIN_PASSWORD_LENGTH = 8;

/** Maximum password length. */
export const MAX_PASSWORD_LENGTH = 128;

/** Bcrypt salt rounds. */
export const BCRYPT_SALT_ROUNDS = 12;

/** Password reset token TTL in minutes. */
export const PASSWORD_RESET_TOKEN_EXPIRY_MINUTES = 60;
