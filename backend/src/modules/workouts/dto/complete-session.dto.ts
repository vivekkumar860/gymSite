import { z } from 'zod';

const MIN_RATING = 1;
const MAX_RATING = 5;

/** Zod schema for completing a workout session. */
export const CompleteSessionSchema = z.object({
  rating: z.number().int().min(MIN_RATING).max(MAX_RATING).optional(),
  notes: z.string().max(2000).optional(),
});

export type CompleteSessionDto = z.infer<typeof CompleteSessionSchema>;
