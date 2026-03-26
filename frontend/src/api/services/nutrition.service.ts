import { z } from "zod";
import { apiClient, ApiError } from "@/api/client";
import type { DailyNutrition } from "@/api/schemas/nutrition.schema";

// ---------------------------------------------------------------------------
// Backend Zod schemas (match NestJS DTOs)
// ---------------------------------------------------------------------------

const mealTemplateSchema = z.object({
  id: z.string(),
  mealName: z.string(),
  mealOrder: z.number(),
  calories: z.number(),
  proteinG: z.number(),
  carbsG: z.number(),
  fatG: z.number(),
  notes: z.string().nullable(),
  foodItems: z.unknown().nullable(),
});

const nutritionPlanWithMealsSchema = z.object({
  id: z.string(),
  planName: z.string(),
  dietType: z.string(),
  dailyCalories: z.number(),
  dailyProteinG: z.number(),
  dailyCarbsG: z.number(),
  dailyFatG: z.number(),
  isActive: z.boolean(),
  mealPlanType: z.string().nullable(),
  activityLevel: z.string().nullable(),
  goalType: z.string().nullable(),
  createdAt: z.string(),
  meals: z.array(mealTemplateSchema),
});

type BackendNutritionPlan = z.infer<typeof nutritionPlanWithMealsSchema>;

// ---------------------------------------------------------------------------
// Nutrition Service — wired to real backend
// ---------------------------------------------------------------------------

/**
 * Build a DailyNutrition object from the active nutrition plan.
 *
 * The backend has meal _templates_ (planned meals), not logged meals per date.
 * We return the plan's meals and targets for the requested date.
 */
export async function getDailyNutrition(date: string): Promise<DailyNutrition> {
  try {
    const plan = await apiClient.get(
      "/nutrition-plans/active",
      nutritionPlanWithMealsSchema,
    );

    return composeDailyNutrition(plan, date);
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) {
      return emptyDailyNutrition(date);
    }
    throw err;
  }
}

function composeDailyNutrition(
  plan: BackendNutritionPlan,
  date: string,
): DailyNutrition {
  const meals = plan.meals
    .sort((a, b) => a.mealOrder - b.mealOrder)
    .map((m) => ({
      id: m.id,
      name: mapMealName(m.mealName),
      items: [],
      totalMacros: {
        calories: m.calories,
        protein: m.proteinG,
        carbs: m.carbsG,
        fat: m.fatG,
      },
      loggedAt: date,
    }));

  const totalMacros = {
    calories: meals.reduce((s, m) => s + m.totalMacros.calories, 0),
    protein: meals.reduce((s, m) => s + m.totalMacros.protein, 0),
    carbs: meals.reduce((s, m) => s + m.totalMacros.carbs, 0),
    fat: meals.reduce((s, m) => s + m.totalMacros.fat, 0),
  };

  return {
    date,
    meals,
    totalMacros,
    targetMacros: {
      calories: plan.dailyCalories,
      protein: plan.dailyProteinG,
      carbs: plan.dailyCarbsG,
      fat: plan.dailyFatG,
    },
  };
}

function mapMealName(
  backendName: string,
): "breakfast" | "lunch" | "dinner" | "snack" {
  const lower = backendName.toLowerCase();
  if (lower.includes("breakfast")) return "breakfast";
  if (lower.includes("lunch")) return "lunch";
  if (lower.includes("dinner") || lower.includes("supper")) return "dinner";
  return "snack";
}

function emptyDailyNutrition(date: string): DailyNutrition {
  return {
    date,
    meals: [],
    totalMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    targetMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  };
}

// ---------------------------------------------------------------------------
// Meal logging stubs — backend doesn't have per-item meal logging yet
// ---------------------------------------------------------------------------

export async function logMeal(
  _data: unknown,
): Promise<unknown> {
  throw new ApiError(501, "Meal logging not yet implemented on backend");
}

export async function updateMealItem(
  _id: string,
  _data: unknown,
): Promise<unknown> {
  throw new ApiError(501, "Meal item update not yet implemented on backend");
}

export async function deleteMealItem(_id: string): Promise<void> {
  throw new ApiError(501, "Meal item delete not yet implemented on backend");
}

import type { FoodItem } from "@/api/schemas/nutrition.schema";

export async function searchFoods(
  _query: string,
): Promise<{ data: FoodItem[]; meta: { page: number; limit: number; totalCount: number; totalPages: number } }> {
  // No food database endpoint on backend yet
  return { data: [], meta: { page: 1, limit: 20, totalCount: 0, totalPages: 0 } };
}
