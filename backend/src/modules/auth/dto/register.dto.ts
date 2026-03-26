import { z } from 'zod';
import { passwordSchema } from './password-rules';

const USERNAME_MIN = 3;
const USERNAME_MAX = 30;
const EMAIL_MAX = 255;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

/** Zod schema for user registration input validation. */
export const RegisterSchema = z.object({
  username: z
    .string()
    .trim()
    .min(USERNAME_MIN, `Username must be at least ${USERNAME_MIN} characters`)
    .max(USERNAME_MAX, `Username must be at most ${USERNAME_MAX} characters`)
    .regex(
      USERNAME_PATTERN,
      'Username can only contain letters, numbers, and underscores',
    ),

  email: z.string().trim().email('Invalid email address').max(EMAIL_MAX),

  password: passwordSchema,
});

/** Validated registration input. */
export type RegisterDto = z.infer<typeof RegisterSchema>;
