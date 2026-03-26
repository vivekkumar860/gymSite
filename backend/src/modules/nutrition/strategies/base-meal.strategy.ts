import {
  CALORIES_PER_GRAM_PROTEIN,
  CALORIES_PER_GRAM_CARBS,
  CALORIES_PER_GRAM_FAT,
  MEAL_DISTRIBUTION,
} from '../constants/nutrition.constants';
import type {
  NutritionTargets,
  GeneratedMeal,
  FoodItem,
} from '../interfaces/nutrition.interfaces';

/** Template food item before calorie scaling */
export interface TemplateFoodItem {
  name: string;
  baseQuantity: string;
  baseCalories: number;
  baseProteinG: number;
  baseCarbsG: number;
  baseFatG: number;
}

/** A template meal with base foods (at reference calorie level) */
export interface TemplateMeal {
  mealName: string;
  foods: TemplateFoodItem[];
  notes: string;
}

/**
 * Shared utilities for meal plan strategies.
 * Handles calorie-proportional scaling and macro distribution across meals.
 */
export function buildMealsFromTemplates(
  templates: TemplateMeal[],
  targets: NutritionTargets,
): GeneratedMeal[] {
  const distribution =
    templates.length <= 4
      ? MEAL_DISTRIBUTION.FOUR_MEALS
      : MEAL_DISTRIBUTION.FIVE_MEALS;

  return templates.map((template, index) => {
    const mealPct = distribution[index]?.pct ?? 1 / templates.length;
    const mealCalories = Math.round(targets.dailyCalories * mealPct);
    const mealProteinG = Math.round(targets.dailyProteinG * mealPct);
    const mealCarbsG = Math.round(targets.dailyCarbsG * mealPct);
    const mealFatG = Math.round(targets.dailyFatG * mealPct);

    const templateTotalCalories = template.foods.reduce(
      (sum, f) => sum + f.baseCalories,
      0,
    );
    const scaleFactor =
      templateTotalCalories > 0 ? mealCalories / templateTotalCalories : 1;

    const foodItems: FoodItem[] = template.foods.map((food) => ({
      name: food.name,
      quantity: scaleQuantity(food.baseQuantity, scaleFactor),
      calories: Math.round(food.baseCalories * scaleFactor),
      proteinG: Math.round(food.baseProteinG * scaleFactor),
      carbsG: Math.round(food.baseCarbsG * scaleFactor),
      fatG: Math.round(food.baseFatG * scaleFactor),
    }));

    return {
      mealName: template.mealName,
      mealOrder: index + 1,
      calories: mealCalories,
      proteinG: mealProteinG,
      carbsG: mealCarbsG,
      fatG: mealFatG,
      notes: template.notes,
      foodItems,
    };
  });
}

/** Scale a human-readable quantity string by a factor. */
function scaleQuantity(baseQuantity: string, factor: number): string {
  const match = baseQuantity.match(/^([\d.]+)\s*(.*)/);
  if (!match) return baseQuantity;

  const scaledAmount = Math.round(parseFloat(match[1]) * factor);
  const unit = match[2];
  return `${scaledAmount} ${unit}`.trim();
}
