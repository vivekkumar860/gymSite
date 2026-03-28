import { NutritionPlan, MealTemplate } from '@prisma/client';
import {
  NutritionPlanDomain,
  NutritionPlanWithMealsDomain,
  MealTemplateDomain,
} from '../domain/nutrition';
import {
  NutritionPlanResponseDto,
  NutritionPlanWithMealsResponseDto,
  MealTemplateResponseDto,
} from '../dto/nutrition-response.dto';

/** Maps between Prisma nutrition models, domain types, and response DTOs. */
export class NutritionMapper {
  static planToDomain(record: NutritionPlan): NutritionPlanDomain {
    return {
      id: record.id,
      userId: record.userId,
      planName: record.planName,
      dietType: record.dietType,
      dailyCalories: record.dailyCalories,
      dailyProteinG: record.dailyProteinG,
      dailyCarbsG: record.dailyCarbsG,
      dailyFatG: record.dailyFatG,
      bmr: record.bmr,
      tdee: record.tdee,
      isActive: record.isActive,
      mealPlanType: record.mealPlanType,
      activityLevel: record.activityLevel,
      goalType: record.goalType,
      budgetPreference: record.budgetPreference,
      heightCm: record.heightCm ? Number(record.heightCm) : null,
      weightKg: record.weightKg ? Number(record.weightKg) : null,
      ageAtCreation: record.ageAtCreation,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  static planWithMealsToDomain(
    record: NutritionPlan & { mealTemplates: MealTemplate[] },
  ): NutritionPlanWithMealsDomain {
    return {
      ...NutritionMapper.planToDomain(record),
      meals: record.mealTemplates.map(NutritionMapper.mealToDomain),
    };
  }

  static planToResponse(domain: NutritionPlanDomain): NutritionPlanResponseDto {
    return {
      id: domain.id,
      planName: domain.planName,
      dietType: domain.dietType,
      dailyCalories: domain.dailyCalories,
      dailyProteinG: domain.dailyProteinG,
      dailyCarbsG: domain.dailyCarbsG,
      dailyFatG: domain.dailyFatG,
      bmr: domain.bmr ?? null,
      tdee: domain.tdee ?? null,
      isActive: domain.isActive,
      mealPlanType: domain.mealPlanType,
      activityLevel: domain.activityLevel,
      goalType: domain.goalType,
      budgetPreference: domain.budgetPreference,
      createdAt: domain.createdAt.toISOString(),
    };
  }

  static planWithMealsToResponse(
    domain: NutritionPlanWithMealsDomain,
  ): NutritionPlanWithMealsResponseDto {
    return {
      ...NutritionMapper.planToResponse(domain),
      meals: domain.meals.map(NutritionMapper.mealToResponse),
    };
  }

  static mealToDomain(record: MealTemplate): MealTemplateDomain {
    return {
      id: record.id,
      nutritionPlanId: record.nutritionPlanId,
      mealName: record.mealName,
      mealOrder: record.mealOrder,
      calories: record.calories,
      proteinG: record.proteinG,
      carbsG: record.carbsG,
      fatG: record.fatG,
      notes: record.notes,
      foodItems: record.foodItems as unknown[] | null,
    };
  }

  static mealToResponse(domain: MealTemplateDomain): MealTemplateResponseDto {
    return {
      id: domain.id,
      mealName: domain.mealName,
      mealOrder: domain.mealOrder,
      calories: domain.calories,
      proteinG: domain.proteinG,
      carbsG: domain.carbsG,
      fatG: domain.fatG,
      notes: domain.notes,
      foodItems: domain.foodItems,
    };
  }
}
