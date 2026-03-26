/** Context provided to the AI engine for meal swap suggestions. */
export interface MealContextDto {
  userId: string;
  currentMealName: string;
  currentMealCalories: number;
  dietaryPreferences: string[];
  restrictions: string[];
  dailyCalorieTarget: number;
  remainingMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}
