import { z } from 'zod';
import {
  MIN_AGE,
  MAX_AGE,
  MIN_HEIGHT_CM,
  MAX_HEIGHT_CM,
  MIN_WEIGHT_KG,
  MAX_WEIGHT_KG,
} from '../constants/nutrition.constants';

const GENDER_VALUES = ['MALE', 'FEMALE'] as const;

const ACTIVITY_LEVEL_VALUES = [
  'SEDENTARY',
  'LIGHTLY_ACTIVE',
  'MODERATELY_ACTIVE',
  'VERY_ACTIVE',
  'EXTREMELY_ACTIVE',
] as const;

const GOAL_VALUES = [
  'LOSE_WEIGHT',
  'GAIN_MUSCLE',
  'INCREASE_STRENGTH',
  'IMPROVE_ENDURANCE',
  'MAINTAIN',
  'CUSTOM',
] as const;

const MEAL_PLAN_TYPE_VALUES = [
  'INDIAN_VEGETARIAN',
  'INDIAN_NON_VEG',
  'VEGAN',
  'HOSTEL_BUDGET',
  'OFFICE_GOING',
] as const;

const BUDGET_PREFERENCE_VALUES = ['LOW', 'MEDIUM', 'HIGH'] as const;

/** Zod schema for generating a nutrition plan from user body stats and preferences. */
export const GenerateNutritionPlanSchema = z.object({
  age: z
    .number()
    .int()
    .min(MIN_AGE, `Age must be at least ${MIN_AGE}`)
    .max(MAX_AGE, `Age must be at most ${MAX_AGE}`),
  gender: z.enum(GENDER_VALUES, {
    error: 'Gender must be MALE or FEMALE for calorie calculation',
  }),
  heightCm: z
    .number()
    .min(MIN_HEIGHT_CM, `Height must be at least ${MIN_HEIGHT_CM} cm`)
    .max(MAX_HEIGHT_CM, `Height must be at most ${MAX_HEIGHT_CM} cm`),
  weightKg: z
    .number()
    .min(MIN_WEIGHT_KG, `Weight must be at least ${MIN_WEIGHT_KG} kg`)
    .max(MAX_WEIGHT_KG, `Weight must be at most ${MAX_WEIGHT_KG} kg`),
  activityLevel: z.enum(ACTIVITY_LEVEL_VALUES),
  goal: z.enum(GOAL_VALUES),
  dietPreference: z.enum(MEAL_PLAN_TYPE_VALUES),
  budgetPreference: z.enum(BUDGET_PREFERENCE_VALUES),
});

export type GenerateNutritionPlanDto = z.infer<
  typeof GenerateNutritionPlanSchema
>;
