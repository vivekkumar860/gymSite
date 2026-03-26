import { Injectable } from '@nestjs/common';
import {
  MIFFLIN_WEIGHT_COEFF,
  MIFFLIN_HEIGHT_COEFF,
  MIFFLIN_AGE_COEFF,
  MIFFLIN_MALE_CONSTANT,
  MIFFLIN_FEMALE_CONSTANT,
  ACTIVITY_MULTIPLIERS,
  GOAL_CALORIE_ADJUSTMENTS,
  GOAL_TO_DIET_TYPE,
  MACRO_SPLITS,
  CALORIES_PER_GRAM_PROTEIN,
  CALORIES_PER_GRAM_CARBS,
  CALORIES_PER_GRAM_FAT,
  MIN_SAFE_DAILY_CALORIES,
  MAX_SAFE_DAILY_CALORIES,
} from '../constants/nutrition.constants';
import type {
  NutritionTargets,
  BiologicalSexInput,
} from '../interfaces/nutrition.interfaces';

/**
 * Stateless service for calculating nutrition targets from body stats.
 * Uses the Mifflin-St Jeor equation for BMR estimation.
 */
@Injectable()
export class NutritionCalculatorService {
  /**
   * Calculate full nutrition targets from user body stats and goal.
   * Flow: BMR -> TDEE -> goal-adjusted calories -> macro grams.
   */
  calculateTargets(
    age: number,
    gender: BiologicalSexInput,
    heightCm: number,
    weightKg: number,
    activityLevel: string,
    goal: string,
  ): NutritionTargets {
    const bmr = this.calculateBmr(gender, weightKg, heightCm, age);
    const tdee = this.calculateTdee(bmr, activityLevel);
    const dailyCalories = this.adjustCaloriesForGoal(tdee, goal);
    const dietType = this.resolveDietType(goal);
    const macros = this.calculateMacroGrams(dailyCalories, dietType);

    return {
      bmr,
      tdee,
      dailyCalories,
      dietType,
      ...macros,
    };
  }

  /**
   * Mifflin-St Jeor BMR: 10 * weight(kg) + 6.25 * height(cm) - 5 * age + constant.
   * Male constant: +5, Female constant: -161.
   */
  private calculateBmr(
    gender: BiologicalSexInput,
    weightKg: number,
    heightCm: number,
    age: number,
  ): number {
    const sexConstant =
      gender === 'MALE' ? MIFFLIN_MALE_CONSTANT : MIFFLIN_FEMALE_CONSTANT;

    return Math.round(
      MIFFLIN_WEIGHT_COEFF * weightKg +
        MIFFLIN_HEIGHT_COEFF * heightCm -
        MIFFLIN_AGE_COEFF * age +
        sexConstant,
    );
  }

  /** TDEE = BMR * activity multiplier. */
  private calculateTdee(bmr: number, activityLevel: string): number {
    const multiplier =
      ACTIVITY_MULTIPLIERS[activityLevel] ?? ACTIVITY_MULTIPLIERS.SEDENTARY;
    return Math.round(bmr * multiplier);
  }

  /** Apply goal-based calorie adjustment and clamp to safe range. */
  private adjustCaloriesForGoal(tdee: number, goal: string): number {
    const adjustment = GOAL_CALORIE_ADJUSTMENTS[goal] ?? 0;
    const adjusted = tdee + adjustment;
    return Math.round(
      Math.min(
        MAX_SAFE_DAILY_CALORIES,
        Math.max(MIN_SAFE_DAILY_CALORIES, adjusted),
      ),
    );
  }

  /** Map a fitness goal to the appropriate diet type for macro calculation. */
  private resolveDietType(goal: string): string {
    return GOAL_TO_DIET_TYPE[goal] ?? 'MAINTENANCE';
  }

  /** Convert daily calories + diet type into protein/carbs/fat grams. */
  private calculateMacroGrams(
    dailyCalories: number,
    dietType: string,
  ): { dailyProteinG: number; dailyCarbsG: number; dailyFatG: number } {
    const split = MACRO_SPLITS[dietType] ?? MACRO_SPLITS.MAINTENANCE;

    return {
      dailyProteinG: Math.round(
        (dailyCalories * split.proteinPct) / CALORIES_PER_GRAM_PROTEIN,
      ),
      dailyCarbsG: Math.round(
        (dailyCalories * split.carbsPct) / CALORIES_PER_GRAM_CARBS,
      ),
      dailyFatG: Math.round(
        (dailyCalories * split.fatPct) / CALORIES_PER_GRAM_FAT,
      ),
    };
  }
}
