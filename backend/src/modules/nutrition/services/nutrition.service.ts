import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NutritionPlanRepository } from '../repositories/nutrition-plan.repository';
import { NutritionMapper } from '../mappers/nutrition.mapper';
import { NotFoundError, AuthorizationError } from '../../../common/errors';
import { DOMAIN_EVENTS } from '../../../common/constants';
import type { CreateNutritionPlanDto } from '../dto/create-nutrition-plan.dto';
import type { UpdateNutritionPlanDto } from '../dto/update-nutrition-plan.dto';
import type { CreateMealTemplateDto } from '../dto/create-meal-template.dto';
import type {
  NutritionPlanResponseDto,
  MealTemplateResponseDto,
} from '../dto/nutrition-response.dto';

/** Business logic for nutrition plans and meals. */
@Injectable()
export class NutritionService {
  constructor(
    private readonly planRepo: NutritionPlanRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /** Get all plans for a user. */
  async getUserPlans(userId: string): Promise<NutritionPlanResponseDto[]> {
    const plans = await this.planRepo.findByUserId(userId);
    return plans.map(NutritionMapper.planToResponse);
  }

  /** Get a single plan. */
  async getPlanById(
    planId: string,
    userId: string,
  ): Promise<NutritionPlanResponseDto> {
    const plan = await this.findPlanOrFail(planId);
    this.ensureOwnership(plan.userId, userId);
    return NutritionMapper.planToResponse(plan);
  }

  /** Create a nutrition plan. Deactivates others if this one is active. */
  async createPlan(
    userId: string,
    dto: CreateNutritionPlanDto,
  ): Promise<NutritionPlanResponseDto> {
    await this.planRepo.deactivateAllForUser(userId);
    const plan = await this.planRepo.create(userId, dto);

    this.eventEmitter.emit(DOMAIN_EVENTS.NUTRITION_PLAN_CREATED, {
      userId,
      planId: plan.id,
      dietType: plan.dietType,
    });

    return NutritionMapper.planToResponse(plan);
  }

  /** Update a nutrition plan. */
  async updatePlan(
    planId: string,
    userId: string,
    dto: UpdateNutritionPlanDto,
  ): Promise<NutritionPlanResponseDto> {
    const plan = await this.findPlanOrFail(planId);
    this.ensureOwnership(plan.userId, userId);

    const updated = await this.planRepo.update(planId, dto);
    return NutritionMapper.planToResponse(updated);
  }

  /** Delete a nutrition plan. */
  async deletePlan(planId: string, userId: string): Promise<void> {
    const plan = await this.findPlanOrFail(planId);
    this.ensureOwnership(plan.userId, userId);
    await this.planRepo.delete(planId);
  }

  /** Get meals for a plan. */
  async getPlanMeals(
    planId: string,
    userId: string,
  ): Promise<MealTemplateResponseDto[]> {
    const plan = await this.findPlanOrFail(planId);
    this.ensureOwnership(plan.userId, userId);

    const meals = await this.planRepo.findMealsByPlanId(planId);
    return meals.map(NutritionMapper.mealToResponse);
  }

  /** Add a meal to a plan. */
  async addMeal(
    planId: string,
    userId: string,
    dto: CreateMealTemplateDto,
  ): Promise<MealTemplateResponseDto> {
    const plan = await this.findPlanOrFail(planId);
    this.ensureOwnership(plan.userId, userId);

    const meal = await this.planRepo.createMeal(planId, dto);
    return NutritionMapper.mealToResponse(meal);
  }

  /** Remove a meal from a plan. */
  async removeMeal(
    mealId: string,
    planId: string,
    userId: string,
  ): Promise<void> {
    const plan = await this.findPlanOrFail(planId);
    this.ensureOwnership(plan.userId, userId);
    await this.planRepo.deleteMeal(mealId);
  }

  /** Activate a plan, deactivating all others for the user. */
  async activatePlan(
    planId: string,
    userId: string,
  ): Promise<NutritionPlanResponseDto> {
    const plan = await this.findPlanOrFail(planId);
    this.ensureOwnership(plan.userId, userId);

    if (plan.isActive) {
      return NutritionMapper.planToResponse(plan);
    }

    await this.planRepo.deactivateAllForUser(userId);
    const updated = await this.planRepo.update(planId, { isActive: true });
    return NutritionMapper.planToResponse(updated);
  }

  // ── Private helpers ──────────────────────────────────────────

  private async findPlanOrFail(planId: string) {
    const plan = await this.planRepo.findById(planId);
    if (!plan) throw new NotFoundError('NutritionPlan', planId);
    return plan;
  }

  private ensureOwnership(ownerId: string, requesterId: string): void {
    if (ownerId !== requesterId) {
      throw new AuthorizationError('You do not own this resource');
    }
  }
}
