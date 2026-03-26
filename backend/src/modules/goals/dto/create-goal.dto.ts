import { z } from 'zod';

const GOAL_TYPE_VALUES = [
  'LOSE_WEIGHT',
  'GAIN_MUSCLE',
  'INCREASE_STRENGTH',
  'IMPROVE_ENDURANCE',
  'MAINTAIN',
  'CUSTOM',
] as const;

/** Zod schema for creating a goal. */
export const CreateGoalSchema = z.object({
  goalType: z.enum(GOAL_TYPE_VALUES),
  title: z.string().trim().min(1).max(100),
  description: z.string().max(2000).optional(),
  targetValue: z.number().min(0).optional(),
  targetUnit: z.string().trim().max(20).optional(),
  deadline: z.string().date('Must be a valid date (YYYY-MM-DD)').optional(),
});

export type CreateGoalDto = z.infer<typeof CreateGoalSchema>;
