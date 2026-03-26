import { z } from 'zod';

export const workoutSuggestionSchema = z.object({
  adjustmentType: z.enum([
    'increase_volume',
    'decrease_volume',
    'swap_exercise',
    'deload',
    'maintain',
  ]),
  reasoning: z.string().min(10).max(500),
  suggestedExercises: z
    .array(
      z.object({
        name: z.string().min(2).max(100),
        sets: z.number().int().min(1).max(20),
        reps: z.number().int().min(1).max(100),
        restSeconds: z.number().int().min(0).max(600),
      }),
    )
    .min(1)
    .max(12),
  confidenceNote: z.string().min(5).max(300),
});
