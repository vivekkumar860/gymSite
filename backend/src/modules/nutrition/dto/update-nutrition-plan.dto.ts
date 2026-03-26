import { z } from 'zod';
import { CreateNutritionPlanSchema } from './create-nutrition-plan.dto';

/** Zod schema for updating a nutrition plan. */
export const UpdateNutritionPlanSchema =
  CreateNutritionPlanSchema.partial().extend({
    isActive: z.boolean().optional(),
  });

export type UpdateNutritionPlanDto = z.infer<typeof UpdateNutritionPlanSchema>;
