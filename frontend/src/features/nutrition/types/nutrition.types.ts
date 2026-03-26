export type {
  DailyNutrition,
  Meal,
  MealItem,
  FoodItem,
  Macros,
} from "@/api/schemas/nutrition.schema";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type LogMealFormValues = {
  mealType: MealType;
  foodItemId: string;
  foodName: string;
  quantity: number;
  macrosPerServing: { calories: number; protein: number; carbs: number; fat: number };
};
