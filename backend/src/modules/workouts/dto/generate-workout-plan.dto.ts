import { z } from 'zod';
import { EQUIPMENT_VALUES } from '../../exercises/constants/exercise-enums';

const GOAL_VALUES = [
  'LOSE_WEIGHT',
  'GAIN_MUSCLE',
  'INCREASE_STRENGTH',
  'IMPROVE_ENDURANCE',
  'MAINTAIN',
] as const;

const EXPERIENCE_VALUES = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;

const MIN_DAYS_PER_WEEK = 1;
const MAX_DAYS_PER_WEEK = 7;
const MIN_DURATION_MINUTES = 20;
const MAX_DURATION_MINUTES = 120;
const MAX_DURATION_WEEKS = 52;
const MAX_RESTRICTIONS = 20;

/** Zod schema for workout plan generation input. */
export const GenerateWorkoutPlanSchema = z.object({
  goal: z.enum(GOAL_VALUES),
  experienceLevel: z.enum(EXPERIENCE_VALUES),
  daysPerWeek: z.number().int().min(MIN_DAYS_PER_WEEK).max(MAX_DAYS_PER_WEEK),
  durationWeeks: z.number().int().min(1).max(MAX_DURATION_WEEKS).default(8),
  sessionDurationMinutes: z
    .number()
    .int()
    .min(MIN_DURATION_MINUTES)
    .max(MAX_DURATION_MINUTES)
    .default(60),
  availableEquipment: z.array(z.enum(EQUIPMENT_VALUES)).min(1),
  injuryRestrictions: z
    .array(z.string().trim().max(100))
    .max(MAX_RESTRICTIONS)
    .default([]),
});

/** Validated input for workout plan generation. */
export type GenerateWorkoutPlanDto = z.infer<typeof GenerateWorkoutPlanSchema>;
