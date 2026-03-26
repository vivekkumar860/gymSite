import { Injectable } from '@nestjs/common';
import { ValidationError } from '../../../common/errors';
import type {
  MealPlanStrategy,
  MealPlanTypeInput,
} from '../interfaces/nutrition.interfaces';
import { IndianVegetarianMealStrategy } from './indian-vegetarian-meal.strategy';
import { IndianNonVegMealStrategy } from './indian-non-veg-meal.strategy';
import { VeganMealStrategy } from './vegan-meal.strategy';
import { HostelBudgetMealStrategy } from './hostel-budget-meal.strategy';
import { OfficeGoingMealStrategy } from './office-going-meal.strategy';

/**
 * Resolves the correct MealPlanStrategy for a given diet preference.
 * All strategies are injected via DI and indexed by their plan type.
 */
@Injectable()
export class MealPlanStrategyResolver {
  private readonly strategyMap: Map<MealPlanTypeInput, MealPlanStrategy>;

  constructor(
    private readonly indianVeg: IndianVegetarianMealStrategy,
    private readonly indianNonVeg: IndianNonVegMealStrategy,
    private readonly vegan: VeganMealStrategy,
    private readonly hostelBudget: HostelBudgetMealStrategy,
    private readonly officeGoing: OfficeGoingMealStrategy,
  ) {
    this.strategyMap = new Map<MealPlanTypeInput, MealPlanStrategy>([
      ['INDIAN_VEGETARIAN', this.indianVeg],
      ['INDIAN_NON_VEG', this.indianNonVeg],
      ['VEGAN', this.vegan],
      ['HOSTEL_BUDGET', this.hostelBudget],
      ['OFFICE_GOING', this.officeGoing],
    ]);
  }

  /** Resolve a strategy by plan type. Throws if unsupported. */
  resolve(planType: MealPlanTypeInput): MealPlanStrategy {
    const strategy = this.strategyMap.get(planType);
    if (!strategy) {
      throw new ValidationError(`Unsupported meal plan type: ${planType}`);
    }
    return strategy;
  }
}
