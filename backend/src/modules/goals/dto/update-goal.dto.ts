import { z } from 'zod';

const GOAL_STATUS_VALUES = [
  'ACTIVE',
  'ACHIEVED',
  'ABANDONED',
  'EXPIRED',
] as const;

/** Zod schema for updating a goal. */
export const UpdateGoalSchema = z.object({
  title: z.string().trim().min(1).max(100).optional(),
  description: z.string().max(2000).optional(),
  targetValue: z.number().min(0).optional(),
  currentValue: z.number().min(0).optional(),
  goalStatus: z.enum(GOAL_STATUS_VALUES).optional(),
  deadline: z.string().date('Must be a valid date (YYYY-MM-DD)').optional(),
});

export type UpdateGoalDto = z.infer<typeof UpdateGoalSchema>;
