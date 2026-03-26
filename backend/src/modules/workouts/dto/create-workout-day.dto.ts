import { z } from 'zod';

/** Zod schema for creating a workout day within a plan. */
export const CreateWorkoutDaySchema = z.object({
  dayName: z.string().trim().min(1).max(60),
  dayOrder: z.number().int().min(1).max(7),
  focusArea: z.string().trim().max(60).optional(),
});

export type CreateWorkoutDayDto = z.infer<typeof CreateWorkoutDaySchema>;
