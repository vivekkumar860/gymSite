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
 * Generates a fully vegan meal plan.
 * Features tofu, legumes, plant milks, nuts, and whole grains.
 */
@Injectable()
export class VeganMealStrategy implements MealPlanStrategy {
  readonly planType = 'VEGAN' as const;

  /** Generate scaled vegan meals matching the calorie targets. */
  generateMeals(
    targets: NutritionTargets,
    budgetPreference: BudgetPreferenceInput,
  ): GeneratedMeal[] {
    const templates = this.getTemplates(budgetPreference);
    return buildMealsFromTemplates(templates, targets);
  }

  generateSingleMeal(params: SingleMealParams, budgetPreference: BudgetPreferenceInput): GeneratedMeal {
    const templates = this.getTemplates(budgetPreference);
    const template = templates.find((t) => t.mealName.toLowerCase() === params.mealName.toLowerCase()) ?? templates[0];
    return buildSingleMealFromTemplate(template, params.mealOrder, params.targetCalories, params.targetProteinG, params.targetCarbsG, params.targetFatG);
  }

  private getTemplates(budget: BudgetPreferenceInput): TemplateMeal[] {
    const useTofu = budget !== 'LOW';

    return [
      {
        mealName: 'Breakfast',
        notes: 'Plant-protein breakfast bowl',
        foods: [
          {
            name: 'Oats with plant milk',
            baseQuantity: '80 g oats',
            baseCalories: 300,
            baseProteinG: 10,
            baseCarbsG: 50,
            baseFatG: 6,
          },
          {
            name: 'Peanut butter',
            baseQuantity: '20 g',
            baseCalories: 120,
            baseProteinG: 5,
            baseCarbsG: 4,
            baseFatG: 10,
          },
          {
            name: 'Mixed berries',
            baseQuantity: '100 g',
            baseCalories: 50,
            baseProteinG: 1,
            baseCarbsG: 12,
            baseFatG: 0,
          },
        ],
      },
      {
        mealName: 'Lunch',
        notes: 'Legume-based protein lunch',
        foods: [
          {
            name: 'Chickpea salad bowl',
            baseQuantity: '200 g',
            baseCalories: 240,
            baseProteinG: 12,
            baseCarbsG: 35,
            baseFatG: 6,
          },
          {
            name: 'Quinoa',
            baseQuantity: '150 g',
            baseCalories: 180,
            baseProteinG: 7,
            baseCarbsG: 32,
            baseFatG: 3,
          },
          {
            name: useTofu ? 'Grilled tofu' : 'Rajma (kidney beans)',
            baseQuantity: '150 g',
            baseCalories: useTofu ? 180 : 160,
            baseProteinG: useTofu ? 16 : 10,
            baseCarbsG: useTofu ? 4 : 24,
            baseFatG: useTofu ? 11 : 2,
          },
        ],
      },
      {
        mealName: 'Snack',
        notes: 'Nutrient-dense vegan snack',
        foods: [
          {
            name: 'Trail mix (nuts, seeds, dried fruit)',
            baseQuantity: '40 g',
            baseCalories: 200,
            baseProteinG: 6,
            baseCarbsG: 18,
            baseFatG: 12,
          },
          {
            name: 'Soy milk',
            baseQuantity: '200 ml',
            baseCalories: 80,
            baseProteinG: 7,
            baseCarbsG: 4,
            baseFatG: 4,
          },
        ],
      },
      {
        mealName: 'Dinner',
        notes: 'Hearty vegan dinner',
        foods: [
          {
            name: 'Lentil soup (masoor dal)',
            baseQuantity: '250 g',
            baseCalories: 200,
            baseProteinG: 14,
            baseCarbsG: 30,
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
            name: 'Stir-fried vegetables with sesame',
            baseQuantity: '200 g',
            baseCalories: 140,
            baseProteinG: 4,
            baseCarbsG: 16,
            baseFatG: 7,
          },
        ],
      },
    ];
  }
}
