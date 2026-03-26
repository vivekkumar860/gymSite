import { Injectable } from '@nestjs/common';
import { MealPlanStrategyResolver } from '../strategies/meal-plan-strategy.resolver';
import type {
  NutritionTargets,
  GeneratedMeal,
  MealPlanTypeInput,
  BudgetPreferenceInput,
} from '../interfaces/nutrition.interfaces';

/**
 * Dispatches meal generation to the appropriate strategy.
 * Acts as a thin orchestrator between the resolver and the strategy.
 */
@Injectable()
export class MealPlanGeneratorService {
  constructor(private readonly strategyResolver: MealPlanStrategyResolver) {}

  /**
   * Generate a set of meals using the strategy matching the given plan type.
   * The selected strategy scales food portions to match the calorie targets.
   */
  generate(
    planType: MealPlanTypeInput,
    targets: NutritionTargets,
    budgetPreference: BudgetPreferenceInput,
  ): GeneratedMeal[] {
    const strategy = this.strategyResolver.resolve(planType);
    return strategy.generateMeals(targets, budgetPreference);
  }
}
