import { z } from 'zod';

const MIN_DAYS_PER_WEEK = 1;
const MAX_DAYS_PER_WEEK = 7;
const MAX_DURATION_WEEKS = 52;

/** Zod schema for creating a workout plan. */
export const CreateWorkoutPlanSchema = z.object({
  planName: z.string().trim().min(1).max(100),
  description: z.string().max(2000).optional(),
  goalId: z.string().uuid().optional(),
  durationWeeks: z.number().int().min(1).max(MAX_DURATION_WEEKS).optional(),
  daysPerWeek: z.number().int().min(MIN_DAYS_PER_WEEK).max(MAX_DAYS_PER_WEEK),
});

export type CreateWorkoutPlanDto = z.infer<typeof CreateWorkoutPlanSchema>;
