import { z } from 'zod';

const MIN_REST_SECONDS = 0;
const MAX_REST_SECONDS = 600;

/** Zod schema for adding an exercise to a workout day. */
export const AddDayExerciseSchema = z.object({
  exerciseId: z.string().uuid(),
  exerciseOrder: z.number().int().min(1).max(30),
  targetSets: z.number().int().min(1).max(20),
  targetRepsMin: z.number().int().min(1).max(100),
  targetRepsMax: z.number().int().min(1).max(100),
  restSeconds: z
    .number()
    .int()
    .min(MIN_REST_SECONDS)
    .max(MAX_REST_SECONDS)
    .default(60),
  notes: z.string().max(300).optional(),
});

export type AddDayExerciseDto = z.infer<typeof AddDayExerciseSchema>;
