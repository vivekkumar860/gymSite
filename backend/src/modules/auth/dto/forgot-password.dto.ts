import { z } from 'zod';

/** Zod schema for password reset request input. */
export const ForgotPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255),
});

export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>;
