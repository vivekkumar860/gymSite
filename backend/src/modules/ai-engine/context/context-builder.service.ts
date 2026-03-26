import { Injectable } from '@nestjs/common';
import type { WorkoutContextDto } from '../dto/contexts/workout-context.dto.js';
import type { MealContextDto } from '../dto/contexts/meal-context.dto.js';
import type { ProgressContextDto } from '../dto/contexts/progress-context.dto.js';
import type { MissedWorkoutContextDto } from '../dto/contexts/missed-workout-context.dto.js';
import type { MotivationalContextDto } from '../dto/contexts/motivational-context.dto.js';

/**
 * Transforms typed context DTOs into flat key-value maps for prompt interpolation.
 *
 * Responsible for:
 * - Stripping PII (userId is never forwarded to the LLM)
 * - Serializing complex objects into prompt-friendly strings
 * - Ensuring all required template variables are present
 */
@Injectable()
export class ContextBuilderService {
  /** Build template variables from a workout context. */
  buildWorkoutVariables(ctx: WorkoutContextDto): Record<string, string> {
    return {
      currentPlanSummary: ctx.currentPlanSummary,
      recentSessionLogs: ctx.recentSessionLogs.join('\n'),
      fitnessGoal: ctx.fitnessGoal,
      availableEquipment: ctx.availableEquipment.join(', '),
      experienceLevel: ctx.experienceLevel,
      ...(ctx.injuryNotes ? { injuryNotes: ctx.injuryNotes } : {}),
    };
  }

  /** Build template variables from a meal swap context. */
  buildMealVariables(ctx: MealContextDto): Record<string, string> {
    return {
      currentMealName: ctx.currentMealName,
      currentMealCalories: String(ctx.currentMealCalories),
      dietaryPreferences: ctx.dietaryPreferences.join(', '),
      restrictions: ctx.restrictions.join(', '),
      dailyCalorieTarget: String(ctx.dailyCalorieTarget),
      'remainingMacros.protein': String(ctx.remainingMacros.protein),
      'remainingMacros.carbs': String(ctx.remainingMacros.carbs),
      'remainingMacros.fat': String(ctx.remainingMacros.fat),
    };
  }

  /** Build template variables from a progress context. */
  buildProgressVariables(ctx: ProgressContextDto): Record<string, string> {
    return {
      metricType: ctx.metricType,
      timeframeWeeks: String(ctx.timeframeWeeks),
      dataPoints: JSON.stringify(ctx.dataPoints),
      ...(ctx.goalTarget != null ? { goalTarget: String(ctx.goalTarget) } : {}),
    };
  }

  /** Build template variables from a missed workout context. */
  buildMissedWorkoutVariables(
    ctx: MissedWorkoutContextDto,
  ): Record<string, string> {
    return {
      missedWorkoutName: ctx.missedWorkoutName,
      missedDate: ctx.missedDate,
      daysMissed: String(ctx.daysMissed),
      currentWeekPlan: ctx.currentWeekPlan.join(', '),
      fitnessGoal: ctx.fitnessGoal,
    };
  }

  /** Build template variables from a motivational context. */
  buildMotivationalVariables(
    ctx: MotivationalContextDto,
  ): Record<string, string> {
    return {
      currentStreak: String(ctx.currentStreak),
      recentAchievements: ctx.recentAchievements.join(', '),
      upcomingGoals: ctx.upcomingGoals.join(', '),
      preferredTone: ctx.preferredTone,
    };
  }
}
