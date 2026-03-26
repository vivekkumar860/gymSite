/** AI-generated meal swap suggestion. */
export interface MealSwapSuggestionDto {
  originalMeal: string;
  alternatives: {
    name: string;
    estimatedCalories: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
    briefReason: string;
  }[];
  disclaimer: string;
}
