import { Injectable } from '@nestjs/common';
import type {
  MealPlanStrategy,
  NutritionTargets,
  GeneratedMeal,
  BudgetPreferenceInput,
  SingleMealParams,
} from '../interfaces/nutrition.interfaces';
import {
  buildMealsFromTemplates,
  buildSingleMealFromTemplate,
  TemplateMeal,
} from './base-meal.strategy';

/**
 * Generates a vegetarian Indian meal plan.
 * Features paneer, dal, curd, roti, rice, and seasonal vegetables.
 */
@Injectable()
export class IndianVegetarianMealStrategy implements MealPlanStrategy {
  readonly planType = 'INDIAN_VEGETARIAN' as const;

  /** Generate scaled vegetarian Indian meals matching the calorie targets. */
  generateMeals(
    targets: NutritionTargets,
    budgetPreference: BudgetPreferenceInput,
  ): GeneratedMeal[] {
    const templates = this.getTemplates(budgetPreference);
    return buildMealsFromTemplates(templates, targets);
  }

  /** Regenerate a single meal using its existing macro targets. */
  generateSingleMeal(
    params: SingleMealParams,
    budgetPreference: BudgetPreferenceInput,
  ): GeneratedMeal {
    const templates = this.getTemplates(budgetPreference);
    const template = templates.find(
      (t) => t.mealName.toLowerCase() === params.mealName.toLowerCase(),
    ) ?? templates[0];
    return buildSingleMealFromTemplate(
      template,
      params.mealOrder,
      params.targetCalories,
      params.targetProteinG,
      params.targetCarbsG,
      params.targetFatG,
    );
  }

  private getTemplates(budget: BudgetPreferenceInput): TemplateMeal[] {
    const usePaneer = budget !== 'LOW';

    return [
      {
        mealName: 'Breakfast',
        notes: 'High-protein vegetarian Indian breakfast',
        foods: [
          {
            name: 'Poha with peanuts',
            baseQuantity: '200 g',
            baseCalories: 270,
            baseProteinG: 8,
            baseCarbsG: 42,
            baseFatG: 8,
          },
          {
            name: 'Curd (dahi)',
            baseQuantity: '150 g',
            baseCalories: 90,
            baseProteinG: 5,
            baseCarbsG: 7,
            baseFatG: 5,
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
        notes: 'Balanced dal-rice-sabzi lunch',
        foods: [
          {
            name: 'Dal (toor/moong)',
            baseQuantity: '200 g',
            baseCalories: 180,
            baseProteinG: 12,
            baseCarbsG: 28,
            baseFatG: 2,
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
            name: usePaneer ? 'Paneer sabzi' : 'Mixed veg sabzi',
            baseQuantity: '150 g',
            baseCalories: usePaneer ? 220 : 120,
            baseProteinG: usePaneer ? 14 : 4,
            baseCarbsG: usePaneer ? 8 : 16,
            baseFatG: usePaneer ? 15 : 5,
          },
          {
            name: 'Roti (whole wheat)',
            baseQuantity: '2 pieces',
            baseCalories: 140,
            baseProteinG: 4,
            baseCarbsG: 28,
            baseFatG: 2,
          },
        ],
      },
      {
        mealName: 'Snack',
        notes: 'Light protein-rich snack',
        foods: [
          {
            name: 'Roasted chana',
            baseQuantity: '50 g',
            baseCalories: 180,
            baseProteinG: 10,
            baseCarbsG: 28,
            baseFatG: 3,
          },
          {
            name: 'Buttermilk (chaas)',
            baseQuantity: '200 ml',
            baseCalories: 40,
            baseProteinG: 2,
            baseCarbsG: 5,
            baseFatG: 1,
          },
        ],
      },
      {
        mealName: 'Dinner',
        notes: 'Light but nutritious dinner',
        foods: [
          {
            name: usePaneer ? 'Palak paneer' : 'Chana masala',
            baseQuantity: '200 g',
            baseCalories: usePaneer ? 260 : 210,
            baseProteinG: usePaneer ? 16 : 12,
            baseCarbsG: usePaneer ? 10 : 30,
            baseFatG: usePaneer ? 18 : 5,
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
            name: 'Raita',
            baseQuantity: '100 g',
            baseCalories: 60,
            baseProteinG: 3,
            baseCarbsG: 5,
            baseFatG: 3,
          },
        ],
      },
    ];
  }
}
