import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import {
  NutritionPlanDomain,
  NutritionPlanWithMealsDomain,
  MealTemplateDomain,
} from '../domain/nutrition';
import { NutritionMapper } from '../mappers/nutrition.mapper';
import type { CreateNutritionPlanDto } from '../dto/create-nutrition-plan.dto';
import type { UpdateNutritionPlanDto } from '../dto/update-nutrition-plan.dto';
import type { CreateMealTemplateDto } from '../dto/create-meal-template.dto';
import type { GeneratedMeal } from '../interfaces/nutrition.interfaces';

/** Data access for nutrition plans and meal templates. */
@Injectable()
export class NutritionPlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Find a plan by ID. */
  async findById(id: string): Promise<NutritionPlanDomain | null> {
    const record = await this.prisma.nutritionPlan.findUnique({
      where: { id },
    });
    if (!record) return null;
    return NutritionMapper.planToDomain(record);
  }

  /** Find a plan by ID with its meal templates. */
  async findByIdWithMeals(
    id: string,
  ): Promise<NutritionPlanWithMealsDomain | null> {
    const record = await this.prisma.nutritionPlan.findUnique({
      where: { id },
      include: { mealTemplates: { orderBy: { mealOrder: 'asc' } } },
    });
    if (!record) return null;
    return NutritionMapper.planWithMealsToDomain(record);
  }

  /** Find all plans for a user. */
  async findByUserId(userId: string): Promise<NutritionPlanDomain[]> {
    const records = await this.prisma.nutritionPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(NutritionMapper.planToDomain);
  }

  /** Find the active plan for a user, with meals. */
  async findActivePlanWithMeals(
    userId: string,
  ): Promise<NutritionPlanWithMealsDomain | null> {
    const record = await this.prisma.nutritionPlan.findFirst({
      where: { userId, isActive: true },
      include: { mealTemplates: { orderBy: { mealOrder: 'asc' } } },
    });
    if (!record) return null;
    return NutritionMapper.planWithMealsToDomain(record);
  }

  /** Create a new plan. */
  async create(
    userId: string,
    data: CreateNutritionPlanDto,
  ): Promise<NutritionPlanDomain> {
    const record = await this.prisma.nutritionPlan.create({
      data: { ...data, userId },
    });
    return NutritionMapper.planToDomain(record);
  }

  /** Create a plan with its meal templates in a single transaction. */
  async createPlanWithMeals(
    userId: string,
    planData: {
      planName: string;
      dietType: string;
      dailyCalories: number;
      dailyProteinG: number;
      dailyCarbsG: number;
      dailyFatG: number;
      bmr?: number;
      tdee?: number;
      mealPlanType: string;
      activityLevel: string;
      goalType: string;
      budgetPreference: string;
      heightCm: number;
      weightKg: number;
      ageAtCreation: number;
    },
    meals: GeneratedMeal[],
  ): Promise<NutritionPlanWithMealsDomain> {
    const record = await this.prisma.nutritionPlan.create({
      data: {
        userId,
        planName: planData.planName,
        dietType: planData.dietType as any,
        dailyCalories: planData.dailyCalories,
        dailyProteinG: planData.dailyProteinG,
        dailyCarbsG: planData.dailyCarbsG,
        dailyFatG: planData.dailyFatG,
        bmr: planData.bmr,
        tdee: planData.tdee,
        mealPlanType: planData.mealPlanType as any,
        activityLevel: planData.activityLevel as any,
        goalType: planData.goalType as any,
        budgetPreference: planData.budgetPreference as any,
        heightCm: planData.heightCm,
        weightKg: planData.weightKg,
        ageAtCreation: planData.ageAtCreation,
        isActive: true,
        mealTemplates: {
          create: meals.map((meal) => ({
            mealName: meal.mealName,
            mealOrder: meal.mealOrder,
            calories: meal.calories,
            proteinG: meal.proteinG,
            carbsG: meal.carbsG,
            fatG: meal.fatG,
            notes: meal.notes,
            foodItems: meal.foodItems as any,
          })),
        },
      },
      include: { mealTemplates: { orderBy: { mealOrder: 'asc' } } },
    });

    return NutritionMapper.planWithMealsToDomain(record);
  }

  /** Replace all meals for a plan (delete existing, insert new). */
  async replaceMeals(planId: string, meals: GeneratedMeal[]): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.mealTemplate.deleteMany({
        where: { nutritionPlanId: planId },
      }),
      ...meals.map((meal) =>
        this.prisma.mealTemplate.create({
          data: {
            nutritionPlanId: planId,
            mealName: meal.mealName,
            mealOrder: meal.mealOrder,
            calories: meal.calories,
            proteinG: meal.proteinG,
            carbsG: meal.carbsG,
            fatG: meal.fatG,
            notes: meal.notes,
            foodItems: meal.foodItems as any,
          },
        }),
      ),
    ]);
  }

  /** Update a plan. */
  async update(
    id: string,
    data: UpdateNutritionPlanDto,
  ): Promise<NutritionPlanDomain> {
    const record = await this.prisma.nutritionPlan.update({
      where: { id },
      data,
    });
    return NutritionMapper.planToDomain(record);
  }

  /** Delete a plan. */
  async delete(id: string): Promise<void> {
    await this.prisma.nutritionPlan.delete({ where: { id } });
  }

  /** Deactivate all plans for a user (before activating a new one). */
  async deactivateAllForUser(userId: string): Promise<void> {
    await this.prisma.nutritionPlan.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });
  }

  /** Find meals for a plan. */
  async findMealsByPlanId(planId: string): Promise<MealTemplateDomain[]> {
    const records = await this.prisma.mealTemplate.findMany({
      where: { nutritionPlanId: planId },
      orderBy: { mealOrder: 'asc' },
    });
    return records.map(NutritionMapper.mealToDomain);
  }

  /** Create a meal template. */
  async createMeal(
    planId: string,
    data: CreateMealTemplateDto,
  ): Promise<MealTemplateDomain> {
    const record = await this.prisma.mealTemplate.create({
      data: { ...data, nutritionPlanId: planId },
    });
    return NutritionMapper.mealToDomain(record);
  }

  /** Update a meal template's food items and notes. */
  async updateMealFoodItems(
    mealId: string,
    foodItems: unknown[],
    notes: string,
  ): Promise<void> {
    await this.prisma.mealTemplate.update({
      where: { id: mealId },
      data: { foodItems: foodItems as any, notes },
    });
  }

  /** Delete a meal template. */
  async deleteMeal(mealId: string): Promise<void> {
    await this.prisma.mealTemplate.delete({ where: { id: mealId } });
  }
}
