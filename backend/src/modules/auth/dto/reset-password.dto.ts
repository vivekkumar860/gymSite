import { z } from 'zod';
import { passwordSchema } from './password-rules';

/** Zod schema for password reset completion input. */
export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: passwordSchema,
});

/** Validated password reset input. */
export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;
