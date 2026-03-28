import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NutritionCalculatorService } from '../services/nutrition-calculator.service';
import { MealPlanGeneratorService } from '../services/meal-plan-generator.service';
import { NutritionPlanRepository } from '../repositories/nutrition-plan.repository';
import { NutritionMapper } from '../mappers/nutrition.mapper';
import { NotFoundError, AuthorizationError } from '../../../common/errors';
import { DOMAIN_EVENTS } from '../../../common/constants';
import type { GenerateNutritionPlanDto } from '../dto/generate-nutrition-plan.dto';
import type { NutritionPlanWithMealsResponseDto } from '../dto/nutrition-response.dto';

/**
 * Orchestrates complex nutrition plan generation workflows.
 * Coordinates calculator, generator, and repository without mixing concerns.
 */
@Injectable()
export class NutritionFacade {
  constructor(
    private readonly calculator: NutritionCalculatorService,
    private readonly generator: MealPlanGeneratorService,
    private readonly planRepo: NutritionPlanRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Generate a complete nutrition plan with meals from user body stats.
   * Flow: calculate targets -> generate meals -> deactivate old plans -> persist atomically.
   */
  async generatePlan(
    userId: string,
    dto: GenerateNutritionPlanDto,
  ): Promise<NutritionPlanWithMealsResponseDto> {
    const targets = this.calculator.calculateTargets(
      dto.age,
      dto.gender,
      dto.heightCm,
      dto.weightKg,
      dto.activityLevel,
      dto.goal,
    );

    const meals = await this.generator.generate(
      dto.dietPreference,
      targets,
      dto.budgetPreference,
    );

    await this.planRepo.deactivateAllForUser(userId);

    const planName = this.buildPlanName(dto.dietPreference, dto.goal);

    const plan = await this.planRepo.createPlanWithMeals(
      userId,
      {
        planName,
        dietType: targets.dietType,
        dailyCalories: targets.dailyCalories,
        dailyProteinG: targets.dailyProteinG,
        dailyCarbsG: targets.dailyCarbsG,
        dailyFatG: targets.dailyFatG,
        bmr: targets.bmr,
        tdee: targets.tdee,
        mealPlanType: dto.dietPreference,
        activityLevel: dto.activityLevel,
        goalType: dto.goal,
        budgetPreference: dto.budgetPreference,
        heightCm: dto.heightCm,
        weightKg: dto.weightKg,
        ageAtCreation: dto.age,
      },
      meals,
    );

    this.eventEmitter.emit(DOMAIN_EVENTS.NUTRITION_PLAN_CREATED, {
      userId,
      planId: plan.id,
      dietType: plan.dietType,
      mealPlanType: dto.dietPreference,
    });

    return NutritionMapper.planWithMealsToResponse(plan);
  }

  /** Get the user's currently active nutrition plan with meals. */
  async getActivePlan(
    userId: string,
  ): Promise<NutritionPlanWithMealsResponseDto> {
    const plan = await this.planRepo.findActivePlanWithMeals(userId);
    if (!plan) {
      throw new NotFoundError('Active NutritionPlan', userId);
    }
    return NutritionMapper.planWithMealsToResponse(plan);
  }

  /**
   * Regenerate meals for an existing plan using the stored generation context.
   * Keeps the same calorie/macro targets but produces new meal combinations.
   */
  async regenerateMeals(
    planId: string,
    userId: string,
  ): Promise<NutritionPlanWithMealsResponseDto> {
    const plan = await this.planRepo.findByIdWithMeals(planId);
    if (!plan) throw new NotFoundError('NutritionPlan', planId);
    if (plan.userId !== userId) {
      throw new AuthorizationError('You do not own this resource');
    }
    if (!plan.mealPlanType) {
      throw new NotFoundError('Generation context for NutritionPlan', planId);
    }

    const targets = this.calculator.calculateTargets(
      plan.ageAtCreation!,
      plan.heightCm! >= 170 ? 'MALE' : 'FEMALE',
      Number(plan.heightCm),
      Number(plan.weightKg),
      plan.activityLevel!,
      plan.goalType!,
    );

    const meals = await this.generator.generate(
      plan.mealPlanType as any,
      targets,
      (plan.budgetPreference as any) ?? 'MEDIUM',
    );

    await this.planRepo.replaceMeals(planId, meals);

    const updated = await this.planRepo.findByIdWithMeals(planId);
    return NutritionMapper.planWithMealsToResponse(updated!);
  }

  /**
   * Regenerate a single meal within a plan.
   * Replaces just that meal's food items; all other meals stay unchanged.
   */
  async regenerateSingleMeal(
    planId: string,
    mealId: string,
    userId: string,
  ): Promise<NutritionPlanWithMealsResponseDto> {
    const plan = await this.planRepo.findByIdWithMeals(planId);
    if (!plan) throw new NotFoundError('NutritionPlan', planId);
    if (plan.userId !== userId) {
      throw new AuthorizationError('You do not own this resource');
    }
    if (!plan.mealPlanType) {
      throw new NotFoundError('Generation context for NutritionPlan', planId);
    }

    const meal = plan.meals.find((m) => m.id === mealId);
    if (!meal) throw new NotFoundError('MealTemplate', mealId);

    const generated = await this.generator.generateSingleMeal(
      plan.mealPlanType as any,
      {
        mealName: meal.mealName,
        mealOrder: meal.mealOrder,
        targetCalories: meal.calories,
        targetProteinG: meal.proteinG,
        targetCarbsG: meal.carbsG,
        targetFatG: meal.fatG,
      },
      (plan.budgetPreference as any) ?? 'MEDIUM',
    );

    await this.planRepo.updateMealFoodItems(mealId, generated.foodItems, generated.notes);

    const updated = await this.planRepo.findByIdWithMeals(planId);
    return NutritionMapper.planWithMealsToResponse(updated!);
  }

  private buildPlanName(dietPreference: string, goal: string): string {
    const dietLabel = dietPreference.replace(/_/g, ' ').toLowerCase();
    const goalLabel = goal.replace(/_/g, ' ').toLowerCase();
    return `${this.capitalize(dietLabel)} - ${this.capitalize(goalLabel)}`;
  }

  private capitalize(str: string): string {
    return str.replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
