import { z } from "zod";

export const mealEntrySchema = z.object({
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  foodItemId: z.string().min(1, "Select a food item"),
  foodName: z.string().min(1),
  quantity: z.coerce
    .number()
    .min(0.1, "Quantity must be at least 0.1")
    .max(9999),
});

export type MealEntryFormValues = z.infer<typeof mealEntrySchema>;
