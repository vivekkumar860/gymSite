import { z } from 'zod';

/** Validated environment configuration schema. */
const envSchema = z.object({
  // App
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),

  // Database
  DATABASE_URL: z.string().url(),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),

  // Refresh tokens
  REFRESH_TOKEN_SECRET: z.string().min(32),

  // CORS — required in production, has default for dev
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
}).refine(
  (data) => {
    if (data.NODE_ENV === 'production' && data.CORS_ORIGIN === 'http://localhost:3000') {
      return false;
    }
    return true;
  },
  { message: 'CORS_ORIGIN must be explicitly set in production (not the default localhost value)' },
);

export type EnvConfig = z.output<typeof envSchema>;

/**
 * Validates environment variables at startup.
 * Fails fast if any required variable is missing or invalid.
 */
export function validateEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(`Environment validation failed:\n${formatted}`);
  }

  return result.data;
}
