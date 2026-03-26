import { z } from 'zod';

/** Zod schema for creating a meal template. */
export const CreateMealTemplateSchema = z.object({
  mealName: z.string().trim().min(1).max(60),
  mealOrder: z.number().int().min(1).max(10),
  calories: z.number().int().min(0).max(5000),
  proteinG: z.number().int().min(0).max(500),
  carbsG: z.number().int().min(0).max(1000),
  fatG: z.number().int().min(0).max(500),
  notes: z.string().max(500).optional(),
});

export type CreateMealTemplateDto = z.infer<typeof CreateMealTemplateSchema>;
