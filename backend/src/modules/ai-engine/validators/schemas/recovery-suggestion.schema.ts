import { z } from 'zod';

export const recoverySuggestionSchema = z.object({
  strategy: z.enum(['reschedule', 'merge', 'skip_and_continue']),
  reasoning: z.string().min(10).max(500),
  adjustedSchedule: z
    .array(
      z.object({
        day: z.string().min(1).max(50),
        workoutName: z.string().min(2).max(100),
      }),
    )
    .min(1)
    .max(7),
  motivationalNote: z.string().min(5).max(300),
});
