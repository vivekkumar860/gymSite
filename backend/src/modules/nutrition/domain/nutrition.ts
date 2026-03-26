/** Domain representation of a nutrition plan. */
export interface NutritionPlanDomain {
  id: string;
  userId: string;
  planName: string;
  dietType: string;
  dailyCalories: number;
  dailyProteinG: number;
  dailyCarbsG: number;
  dailyFatG: number;
  isActive: boolean;
  mealPlanType: string | null;
  activityLevel: string | null;
  goalType: string | null;
  budgetPreference: string | null;
  heightCm: number | null;
  weightKg: number | null;
  ageAtCreation: number | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Domain representation of a nutrition plan with its meals. */
export interface NutritionPlanWithMealsDomain extends NutritionPlanDomain {
  meals: MealTemplateDomain[];
}

/** Domain representation of a meal template within a nutrition plan. */
export interface MealTemplateDomain {
  id: string;
  nutritionPlanId: string;
  mealName: string;
  mealOrder: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  notes: string | null;
  foodItems: unknown[] | null;
}
