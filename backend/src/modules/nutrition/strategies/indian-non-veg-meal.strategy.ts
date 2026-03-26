import { Injectable } from '@nestjs/common';
import type {
  MealPlanStrategy,
  NutritionTargets,
  GeneratedMeal,
  BudgetPreferenceInput,
} from '../interfaces/nutrition.interfaces';
import { buildMealsFromTemplates, TemplateMeal } from './base-meal.strategy';

/**
 * Generates a non-vegetarian Indian meal plan.
 * Features chicken, eggs, fish alongside Indian staples.
 */
@Injectable()
export class IndianNonVegMealStrategy implements MealPlanStrategy {
  readonly planType = 'INDIAN_NON_VEG' as const;

  /** Generate scaled non-veg Indian meals matching the calorie targets. */
  generateMeals(
    targets: NutritionTargets,
    budgetPreference: BudgetPreferenceInput,
  ): GeneratedMeal[] {
    const templates = this.getTemplates(budgetPreference);
    return buildMealsFromTemplates(templates, targets);
  }

  private getTemplates(budget: BudgetPreferenceInput): TemplateMeal[] {
    const useChicken = budget !== 'LOW';

    return [
      {
        mealName: 'Breakfast',
        notes: 'Egg-based high-protein breakfast',
        foods: [
          {
            name: 'Egg omelette',
            baseQuantity: '3 eggs',
            baseCalories: 270,
            baseProteinG: 18,
            baseCarbsG: 2,
            baseFatG: 21,
          },
          {
            name: 'Whole wheat toast',
            baseQuantity: '2 slices',
            baseCalories: 140,
            baseProteinG: 5,
            baseCarbsG: 24,
            baseFatG: 2,
          },
          {
            name: 'Banana',
            baseQuantity: '1 medium',
            baseCalories: 105,
            baseProteinG: 1,
            baseCarbsG: 27,
            baseFatG: 0,
          },
        ],
      },
      {
        mealName: 'Lunch',
        notes: 'Chicken or egg curry with rice',
        foods: [
          {
            name: useChicken ? 'Chicken curry' : 'Egg curry',
            baseQuantity: useChicken ? '200 g' : '3 eggs',
            baseCalories: useChicken ? 280 : 240,
            baseProteinG: useChicken ? 30 : 18,
            baseCarbsG: useChicken ? 8 : 6,
            baseFatG: useChicken ? 14 : 16,
          },
          {
            name: 'Brown rice',
            baseQuantity: '150 g',
            baseCalories: 170,
            baseProteinG: 4,
            baseCarbsG: 36,
            baseFatG: 1,
          },
          {
            name: 'Dal (toor)',
            baseQuantity: '150 g',
            baseCalories: 135,
            baseProteinG: 9,
            baseCarbsG: 21,
            baseFatG: 2,
          },
          {
            name: 'Salad (cucumber, onion)',
            baseQuantity: '100 g',
            baseCalories: 25,
            baseProteinG: 1,
            baseCarbsG: 5,
            baseFatG: 0,
          },
        ],
      },
      {
        mealName: 'Snack',
        notes: 'Quick protein snack',
        foods: [
          {
            name: 'Boiled eggs',
            baseQuantity: '2 eggs',
            baseCalories: 140,
            baseProteinG: 12,
            baseCarbsG: 1,
            baseFatG: 10,
          },
          {
            name: 'Mixed nuts',
            baseQuantity: '30 g',
            baseCalories: 170,
            baseProteinG: 5,
            baseCarbsG: 7,
            baseFatG: 15,
          },
        ],
      },
      {
        mealName: 'Dinner',
        notes: 'Grilled protein with roti',
        foods: [
          {
            name: useChicken ? 'Tandoori chicken' : 'Fish fry',
            baseQuantity: '200 g',
            baseCalories: useChicken ? 260 : 230,
            baseProteinG: useChicken ? 32 : 28,
            baseCarbsG: useChicken ? 4 : 8,
            baseFatG: useChicken ? 12 : 10,
          },
          {
            name: 'Roti (whole wheat)',
            baseQuantity: '2 pieces',
            baseCalories: 140,
            baseProteinG: 4,
            baseCarbsG: 28,
            baseFatG: 2,
          },
          {
            name: 'Mixed veg sabzi',
            baseQuantity: '150 g',
            baseCalories: 120,
            baseProteinG: 4,
            baseCarbsG: 16,
            baseFatG: 5,
          },
        ],
      },
    ];
  }
}
