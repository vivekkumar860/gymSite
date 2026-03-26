import { z } from 'zod';

const PLAN_STATUS_VALUES = [
  'DRAFT',
  'ACTIVE',
  'PAUSED',
  'COMPLETED',
  'ARCHIVED',
] as const;

/** Zod schema for updating a workout plan. */
export const UpdateWorkoutPlanSchema = z.object({
  planName: z.string().trim().min(1).max(100).optional(),
  description: z.string().max(2000).optional(),
  planStatus: z.enum(PLAN_STATUS_VALUES).optional(),
  durationWeeks: z.number().int().min(1).max(52).optional(),
  daysPerWeek: z.number().int().min(1).max(7).optional(),
});

export type UpdateWorkoutPlanDto = z.infer<typeof UpdateWorkoutPlanSchema>;
