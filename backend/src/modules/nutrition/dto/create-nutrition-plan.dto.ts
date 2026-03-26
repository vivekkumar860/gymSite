import { z } from 'zod';

const DIET_TYPE_VALUES = [
  'BULKING',
  'CUTTING',
  'MAINTENANCE',
  'RECOMPOSITION',
] as const;

/** Zod schema for creating a nutrition plan. */
export const CreateNutritionPlanSchema = z.object({
  planName: z.string().trim().min(1).max(100),
  dietType: z.enum(DIET_TYPE_VALUES),
  dailyCalories: z.number().int().min(800).max(10000),
  dailyProteinG: z.number().int().min(0).max(1000),
  dailyCarbsG: z.number().int().min(0).max(2000),
  dailyFatG: z.number().int().min(0).max(1000),
});

export type CreateNutritionPlanDto = z.infer<typeof CreateNutritionPlanSchema>;
