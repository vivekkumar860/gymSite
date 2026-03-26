import { Injectable } from '@nestjs/common';
import type {
  MealPlanStrategy,
  NutritionTargets,
  GeneratedMeal,
  BudgetPreferenceInput,
} from '../interfaces/nutrition.interfaces';
import { buildMealsFromTemplates, TemplateMeal } from './base-meal.strategy';

/**
 * Generates a budget-friendly hostel meal plan.
 * Features cheap, minimal-cooking staples: eggs, oats, bananas, peanut butter, bread.
 */
@Injectable()
export class HostelBudgetMealStrategy implements MealPlanStrategy {
  readonly planType = 'HOSTEL_BUDGET' as const;

  /** Generate scaled budget hostel meals matching the calorie targets. */
  generateMeals(
    targets: NutritionTargets,
    _budgetPreference: BudgetPreferenceInput,
  ): GeneratedMeal[] {
    const templates = this.getTemplates();
    return buildMealsFromTemplates(templates, targets);
  }

  private getTemplates(): TemplateMeal[] {
    return [
      {
        mealName: 'Breakfast',
        notes: 'No-cook quick breakfast',
        foods: [
          {
            name: 'Overnight oats with milk',
            baseQuantity: '80 g oats',
            baseCalories: 340,
            baseProteinG: 12,
            baseCarbsG: 52,
            baseFatG: 8,
          },
          {
            name: 'Banana',
            baseQuantity: '1 medium',
            baseCalories: 105,
            baseProteinG: 1,
            baseCarbsG: 27,
            baseFatG: 0,
          },
          {
            name: 'Peanut butter',
            baseQuantity: '20 g',
            baseCalories: 120,
            baseProteinG: 5,
            baseCarbsG: 4,
            baseFatG: 10,
          },
        ],
      },
      {
        mealName: 'Lunch',
        notes: 'Mess/canteen-style affordable lunch',
        foods: [
          {
            name: 'Rice',
            baseQuantity: '200 g',
            baseCalories: 230,
            baseProteinG: 5,
            baseCarbsG: 50,
            baseFatG: 1,
          },
          {
            name: 'Dal (moong/masoor)',
            baseQuantity: '200 g',
            baseCalories: 180,
            baseProteinG: 12,
            baseCarbsG: 28,
            baseFatG: 2,
          },
          {
            name: 'Boiled eggs',
            baseQuantity: '2 eggs',
            baseCalories: 140,
            baseProteinG: 12,
            baseCarbsG: 1,
            baseFatG: 10,
          },
        ],
      },
      {
        mealName: 'Snack',
        notes: 'Budget protein snack',
        foods: [
          {
            name: 'Bread with peanut butter',
            baseQuantity: '2 slices',
            baseCalories: 260,
            baseProteinG: 10,
            baseCarbsG: 28,
            baseFatG: 12,
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
        mealName: 'Dinner',
        notes: 'Simple filling dinner',
        foods: [
          {
            name: 'Roti (from mess)',
            baseQuantity: '3 pieces',
            baseCalories: 210,
            baseProteinG: 6,
            baseCarbsG: 42,
            baseFatG: 3,
          },
          {
            name: 'Egg bhurji',
            baseQuantity: '3 eggs',
            baseCalories: 240,
            baseProteinG: 18,
            baseCarbsG: 3,
            baseFatG: 18,
          },
          {
            name: 'Milk',
            baseQuantity: '200 ml',
            baseCalories: 120,
            baseProteinG: 6,
            baseCarbsG: 10,
            baseFatG: 6,
          },
        ],
      },
    ];
  }
}
