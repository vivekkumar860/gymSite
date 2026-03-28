// ============================================================
// Nutrition Module — Interfaces
// ============================================================

/** Biological sex values accepted for BMR calculation */
export type BiologicalSexInput = 'MALE' | 'FEMALE';

/** Activity level values matching the Prisma ActivityLevel enum */
export type ActivityLevelInput =
  | 'SEDENTARY'
  | 'LIGHTLY_ACTIVE'
  | 'MODERATELY_ACTIVE'
  | 'VERY_ACTIVE'
  | 'EXTREMELY_ACTIVE';

/** Goal type values matching the Prisma GoalType enum */
export type GoalTypeInput =
  | 'LOSE_WEIGHT'
  | 'GAIN_MUSCLE'
  | 'INCREASE_STRENGTH'
  | 'IMPROVE_ENDURANCE'
  | 'MAINTAIN'
  | 'CUSTOM';

/** Meal plan strategy type matching the Prisma MealPlanType enum */
export type MealPlanTypeInput =
  | 'INDIAN_VEGETARIAN'
  | 'INDIAN_NON_VEG'
  | 'VEGAN'
  | 'HOSTEL_BUDGET'
  | 'OFFICE_GOING';

/** Budget preference matching the Prisma BudgetPreference enum */
export type BudgetPreferenceInput = 'LOW' | 'MEDIUM' | 'HIGH';

/** Input required to generate a full nutrition plan */
export interface GenerateNutritionPlanInput {
  age: number;
  gender: BiologicalSexInput;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevelInput;
  goal: GoalTypeInput;
  dietPreference: MealPlanTypeInput;
  budgetPreference: BudgetPreferenceInput;
}

/** Calculated nutrition targets from user body stats and goal */
export interface NutritionTargets {
  bmr: number;
  tdee: number;
  dailyCalories: number;
  dailyProteinG: number;
  dailyCarbsG: number;
  dailyFatG: number;
  dietType: string;
}

/** A single food item within a meal */
export interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

/** A generated meal with its macros and food items */
export interface GeneratedMeal {
  mealName: string;
  mealOrder: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  notes: string;
  foodItems: FoodItem[];
}

/** Parameters for regenerating a single meal within a plan */
export interface SingleMealParams {
  mealName: string;
  mealOrder: number;
  targetCalories: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatG: number;
}

/** Strategy interface for generating meal plans based on dietary preference */
export interface MealPlanStrategy {
  readonly planType: MealPlanTypeInput;
  generateMeals(
    targets: NutritionTargets,
    budgetPreference: BudgetPreferenceInput,
  ): GeneratedMeal[];
  generateSingleMeal(
    params: SingleMealParams,
    budgetPreference: BudgetPreferenceInput,
  ): GeneratedMeal;
}
