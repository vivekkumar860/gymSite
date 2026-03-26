import { z } from 'zod';

/** Zod schema for starting a workout session. */
export const StartSessionSchema = z.object({
  dayId: z.string().uuid().optional(),
  notes: z.string().max(2000).optional(),
});

export type StartSessionDto = z.infer<typeof StartSessionSchema>;
