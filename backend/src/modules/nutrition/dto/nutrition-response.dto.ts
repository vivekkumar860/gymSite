/** Shape of a nutrition plan response. */
export interface NutritionPlanResponseDto {
  id: string;
  planName: string;
  dietType: string;
  dailyCalories: number;
  dailyProteinG: number;
  dailyCarbsG: number;
  dailyFatG: number;
  bmr: number | null;
  tdee: number | null;
  isActive: boolean;
  mealPlanType: string | null;
  activityLevel: string | null;
  goalType: string | null;
  budgetPreference: string | null;
  createdAt: string;
}

/** Shape of a meal template response. */
export interface MealTemplateResponseDto {
  id: string;
  mealName: string;
  mealOrder: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  notes: string | null;
  foodItems: unknown[] | null;
}

/** Shape of a nutrition plan response including its meals. */
export interface NutritionPlanWithMealsResponseDto extends NutritionPlanResponseDto {
  meals: MealTemplateResponseDto[];
}
