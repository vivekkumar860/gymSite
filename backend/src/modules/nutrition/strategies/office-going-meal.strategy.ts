import { Injectable } from '@nestjs/common';
import type {
  MealPlanStrategy,
  NutritionTargets,
  GeneratedMeal,
  BudgetPreferenceInput,
} from '../interfaces/nutrition.interfaces';
import { buildMealsFromTemplates, TemplateMeal } from './base-meal.strategy';

/**
 * Generates a meal plan for office-going professionals.
 * Features meal-prep friendly options, packable lunches, and quick breakfasts.
 */
@Injectable()
export class OfficeGoingMealStrategy implements MealPlanStrategy {
  readonly planType = 'OFFICE_GOING' as const;

  /** Generate scaled office-friendly meals matching the calorie targets. */
  generateMeals(
    targets: NutritionTargets,
    budgetPreference: BudgetPreferenceInput,
  ): GeneratedMeal[] {
    const templates = this.getTemplates(budgetPreference);
    return buildMealsFromTemplates(templates, targets);
  }

  private getTemplates(budget: BudgetPreferenceInput): TemplateMeal[] {
    const premiumProtein = budget === 'HIGH';

    return [
      {
        mealName: 'Breakfast',
        notes: 'Quick prep breakfast before office',
        foods: [
          {
            name: 'Moong dal chilla',
            baseQuantity: '2 pieces',
            baseCalories: 200,
            baseProteinG: 12,
            baseCarbsG: 24,
            baseFatG: 6,
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
            name: 'Apple',
            baseQuantity: '1 medium',
            baseCalories: 95,
            baseProteinG: 0,
            baseCarbsG: 25,
            baseFatG: 0,
          },
        ],
      },
      {
        mealName: 'Mid-Morning Snack',
        notes: 'Desk-friendly office snack',
        foods: [
          {
            name: 'Mixed nuts',
            baseQuantity: '30 g',
            baseCalories: 170,
            baseProteinG: 5,
            baseCarbsG: 7,
            baseFatG: 15,
          },
          {
            name: 'Green tea',
            baseQuantity: '1 cup',
            baseCalories: 2,
            baseProteinG: 0,
            baseCarbsG: 0,
            baseFatG: 0,
          },
        ],
      },
      {
        mealName: 'Lunch',
        notes: 'Packed lunch or ordered meal',
        foods: [
          {
            name: 'Roti (whole wheat)',
            baseQuantity: '2 pieces',
            baseCalories: 140,
            baseProteinG: 4,
            baseCarbsG: 28,
            baseFatG: 2,
          },
          {
            name: premiumProtein ? 'Grilled chicken' : 'Paneer bhurji',
            baseQuantity: '150 g',
            baseCalories: premiumProtein ? 230 : 220,
            baseProteinG: premiumProtein ? 30 : 14,
            baseCarbsG: premiumProtein ? 2 : 6,
            baseFatG: premiumProtein ? 12 : 16,
          },
          {
            name: 'Mixed veg sabzi',
            baseQuantity: '150 g',
            baseCalories: 120,
            baseProteinG: 4,
            baseCarbsG: 16,
            baseFatG: 5,
          },
          {
            name: 'Salad',
            baseQuantity: '100 g',
            baseCalories: 25,
            baseProteinG: 1,
            baseCarbsG: 5,
            baseFatG: 0,
          },
        ],
      },
      {
        mealName: 'Evening Snack',
        notes: 'Post-work energy boost',
        foods: [
          {
            name: 'Sprouts chaat',
            baseQuantity: '100 g',
            baseCalories: 120,
            baseProteinG: 8,
            baseCarbsG: 18,
            baseFatG: 2,
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
        notes: 'Light home-cooked dinner',
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
            baseQuantity: '100 g',
            baseCalories: 115,
            baseProteinG: 3,
            baseCarbsG: 24,
            baseFatG: 1,
          },
          {
            name: 'Palak (spinach) sabzi',
            baseQuantity: '150 g',
            baseCalories: 100,
            baseProteinG: 4,
            baseCarbsG: 10,
            baseFatG: 5,
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
