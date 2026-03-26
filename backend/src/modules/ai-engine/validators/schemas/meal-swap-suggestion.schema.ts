import { z } from 'zod';

export const mealSwapSuggestionSchema = z.object({
  originalMeal: z.string().min(2).max(200),
  alternatives: z
    .array(
      z.object({
        name: z.string().min(2).max(200),
        estimatedCalories: z.number().min(50).max(5000),
        macros: z.object({
          protein: z.number().min(0).max(500),
          carbs: z.number().min(0).max(500),
          fat: z.number().min(0).max(300),
        }),
        briefReason: z.string().min(5).max(300),
      }),
    )
    .min(1)
    .max(5),
  disclaimer: z.string().min(10).max(500),
});
