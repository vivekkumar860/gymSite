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

// ---------------------------------------------------------------------------
// Nutrition Plan types (from backend meal templates + foodItems JSON)
// ---------------------------------------------------------------------------

/** A food item stored in the backend meal template's foodItems JSON column. */
export type PlanFoodItem = {
  name: string;
  /** Human-readable quantity, e.g. "200g", "2 eggs" */
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

/** A meal within an active nutrition plan. */
export type PlanMeal = {
  id: string;
  name: string;
  order: number;
  notes: string | null;
  macros: Macros;
  foodItems: PlanFoodItem[];
};

/** The active nutrition plan with its meals and daily targets. */
export type NutritionPlanData = {
  id: string;
  planName: string;
  dietType: string;
  mealPlanType: string | null;
  budgetPreference: string | null;
  activityLevel: string | null;
  goalType: string | null;
  bmr: number | null;
  tdee: number | null;
  targetMacros: Macros;
  meals: PlanMeal[];
};

/** Summary of a nutrition plan (used in plan history list). */
export type NutritionPlanSummary = {
  id: string;
  planName: string;
  dietType: string;
  dailyCalories: number;
  isActive: boolean;
  mealPlanType: string | null;
  budgetPreference: string | null;
  createdAt: string;
};
