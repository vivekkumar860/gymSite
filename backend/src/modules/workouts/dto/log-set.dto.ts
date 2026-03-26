import { z } from 'zod';

/** Zod schema for logging a single set during a workout session. */
export const LogSetSchema = z.object({
  exerciseId: z.string().uuid(),
  setNumber: z.number().int().min(1).max(50),
  weightKg: z.number().min(0).max(1000).optional(),
  repsCompleted: z.number().int().min(0).max(200),
  rpe: z.number().min(1).max(10).optional(),
  isWarmup: z.boolean().default(false),
  isFailure: z.boolean().default(false),
});

export type LogSetDto = z.infer<typeof LogSetSchema>;
