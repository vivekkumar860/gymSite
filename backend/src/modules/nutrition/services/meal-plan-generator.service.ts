import { Injectable, Logger } from '@nestjs/common';
import { MealPlanStrategyResolver } from '../strategies/meal-plan-strategy.resolver';
import { FoodItemRepository } from '../repositories/food-item.repository';
import { buildMealFromDbFoods } from '../strategies/db-meal.builder';
import { MEAL_DISTRIBUTION } from '../constants/nutrition.constants';
import type {
  NutritionTargets,
  GeneratedMeal,
  MealPlanTypeInput,
  BudgetPreferenceInput,
  SingleMealParams,
} from '../interfaces/nutrition.interfaces';

/** Maps strategy plan types to whether they are veg-only. */
const VEG_ONLY_MAP: Record<MealPlanTypeInput, boolean> = {
  INDIAN_VEGETARIAN: true,
  VEGAN: true,
  HOSTEL_BUDGET: true,
  INDIAN_NON_VEG: false,
  OFFICE_GOING: false,
};

/** Meal slot definitions for DB-driven generation. */
const MEAL_SLOTS = [
  { name: 'Breakfast', dbMealType: 'breakfast' as const },
  { name: 'Lunch', dbMealType: 'lunch' as const },
  { name: 'Snack', dbMealType: 'breakfast' as const }, // snacks use breakfast foods < 200 cal
  { name: 'Dinner', dbMealType: 'dinner' as const },
];

/**
 * Dispatches meal generation: tries DB-driven food selection first,
 * falls back to the synchronous hardcoded strategy templates.
 */
@Injectable()
export class MealPlanGeneratorService {
  private readonly logger = new Logger(MealPlanGeneratorService.name);

  constructor(
    private readonly strategyResolver: MealPlanStrategyResolver,
    private readonly foodItemRepo: FoodItemRepository,
  ) {}

  /**
   * Generate a full set of meals. Tries DB foods first per meal slot;
   * if any slot fails, falls back entirely to the hardcoded strategy.
   */
  async generate(
    planType: MealPlanTypeInput,
    targets: NutritionTargets,
    budgetPreference: BudgetPreferenceInput,
  ): Promise<GeneratedMeal[]> {
    try {
      const dbMeals = await this.generateFromDb(planType, targets);
      if (dbMeals) return dbMeals;
    } catch (err) {
      this.logger.warn(`DB meal generation failed, falling back to templates: ${err}`);
    }

    // Fallback to synchronous hardcoded templates
    const strategy = this.strategyResolver.resolve(planType);
    return strategy.generateMeals(targets, budgetPreference);
  }

  /** Generate a single meal. Tries DB first, falls back to strategy template. */
  async generateSingleMeal(
    planType: MealPlanTypeInput,
    params: SingleMealParams,
    budgetPreference: BudgetPreferenceInput,
  ): Promise<GeneratedMeal> {
    try {
      const dbMeal = await this.generateSingleFromDb(planType, params);
      if (dbMeal) return dbMeal;
    } catch (err) {
      this.logger.warn(`DB single meal generation failed, falling back: ${err}`);
    }

    const strategy = this.strategyResolver.resolve(planType);
    return strategy.generateSingleMeal(params, budgetPreference);
  }

  /** Try to build all meals from DB food items. Returns null if any slot fails. */
  private async generateFromDb(
    planType: MealPlanTypeInput,
    targets: NutritionTargets,
  ): Promise<GeneratedMeal[] | null> {
    const vegOnly = VEG_ONLY_MAP[planType] ?? true;
    const distribution = MEAL_DISTRIBUTION.FOUR_MEALS;
    const meals: GeneratedMeal[] = [];

    for (let i = 0; i < MEAL_SLOTS.length; i++) {
      const slot = MEAL_SLOTS[i];
      const pct = distribution[i]?.pct ?? 0.25;
      const mealCalories = Math.round(targets.dailyCalories * pct);
      const mealProteinG = Math.round(targets.dailyProteinG * pct);
      const mealCarbsG = Math.round(targets.dailyCarbsG * pct);
      const mealFatG = Math.round(targets.dailyFatG * pct);

      let foods = await this.foodItemRepo.findForMeal(slot.dbMealType, vegOnly);

      // For snacks, filter to low-calorie items
      if (slot.name === 'Snack') {
        foods = foods.filter((f) => f.calories < 200);
      }

      const meal = buildMealFromDbFoods(
        slot.name,
        i + 1,
        mealCalories,
        mealProteinG,
        mealCarbsG,
        mealFatG,
        foods,
      );

      if (!meal) return null; // Any failure → fall back entirely
      meals.push(meal);
    }

    return meals;
  }

  /** Try to build a single meal from DB food items. */
  private async generateSingleFromDb(
    planType: MealPlanTypeInput,
    params: SingleMealParams,
  ): Promise<GeneratedMeal | null> {
    const vegOnly = VEG_ONLY_MAP[planType] ?? true;
    const mealType = this.mapMealNameToType(params.mealName);

    let foods = await this.foodItemRepo.findForMeal(mealType, vegOnly);

    if (params.mealName.toLowerCase().includes('snack')) {
      foods = foods.filter((f) => f.calories < 200);
    }

    return buildMealFromDbFoods(
      params.mealName,
      params.mealOrder,
      params.targetCalories,
      params.targetProteinG,
      params.targetCarbsG,
      params.targetFatG,
      foods,
    );
  }

  private mapMealNameToType(name: string): 'breakfast' | 'lunch' | 'dinner' {
    const lower = name.toLowerCase();
    if (lower.includes('breakfast')) return 'breakfast';
    if (lower.includes('lunch')) return 'lunch';
    if (lower.includes('dinner') || lower.includes('supper')) return 'dinner';
    return 'breakfast'; // snacks, mid-morning etc. use breakfast foods
  }
}
