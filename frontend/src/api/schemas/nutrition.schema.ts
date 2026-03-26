import { z } from "zod";

// ---------------------------------------------------------------------------
// Macros
// ---------------------------------------------------------------------------

export const macrosSchema = z.object({
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
});

export type Macros = z.infer<typeof macrosSchema>;

// ---------------------------------------------------------------------------
// Food Item
// ---------------------------------------------------------------------------

export const foodItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  servingSize: z.number(),
  servingUnit: z.string(),
  macros: macrosSchema,
});

export type FoodItem = z.infer<typeof foodItemSchema>;

// ---------------------------------------------------------------------------
// Meal Item
// ---------------------------------------------------------------------------

export const mealItemSchema = z.object({
  id: z.string(),
  foodItemId: z.string(),
  foodName: z.string(),
  quantity: z.number(),
  macros: macrosSchema,
});

export type MealItem = z.infer<typeof mealItemSchema>;

// ---------------------------------------------------------------------------
// Meal
// ---------------------------------------------------------------------------

export const mealSchema = z.object({
  id: z.string(),
  name: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  items: z.array(mealItemSchema),
  totalMacros: macrosSchema,
  loggedAt: z.string(),
});

export type Meal = z.infer<typeof mealSchema>;

// ---------------------------------------------------------------------------
// Daily Nutrition
// ---------------------------------------------------------------------------

export const dailyNutritionSchema = z.object({
  date: z.string(),
  meals: z.array(mealSchema),
  totalMacros: macrosSchema,
  targetMacros: macrosSchema,
});

export type DailyNutrition = z.infer<typeof dailyNutritionSchema>;
