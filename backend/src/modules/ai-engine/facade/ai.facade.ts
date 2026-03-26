import { Injectable, Logger } from '@nestjs/common';
import { AiOrchestrationService } from '../orchestration/ai-orchestration.service.js';
import { ContextBuilderService } from '../context/context-builder.service.js';
import { AiCapability } from '../types/index.js';
import type { WorkoutContextDto } from '../dto/contexts/workout-context.dto.js';
import type { MealContextDto } from '../dto/contexts/meal-context.dto.js';
import type { ProgressContextDto } from '../dto/contexts/progress-context.dto.js';
import type { MissedWorkoutContextDto } from '../dto/contexts/missed-workout-context.dto.js';
import type { MotivationalContextDto } from '../dto/contexts/motivational-context.dto.js';
import type { WorkoutSuggestionDto } from '../dto/suggestions/workout-suggestion.dto.js';
import type { MealSwapSuggestionDto } from '../dto/suggestions/meal-swap-suggestion.dto.js';
import type { ProgressSummaryDto } from '../dto/suggestions/progress-summary.dto.js';
import type { RecoverySuggestionDto } from '../dto/suggestions/recovery-suggestion.dto.js';
import type { MotivationalSummaryDto } from '../dto/suggestions/motivational-summary.dto.js';

/**
 * Public facade for the AI fitness engine.
 *
 * This is the ONLY class exported from the AiEngineModule.
 * Application services call these methods to get AI suggestions.
 * Every method returns a typed suggestion or a safe deterministic fallback —
 * callers never see raw LLM output or internal errors.
 */
@Injectable()
export class AiFacade {
  private readonly logger = new Logger(AiFacade.name);

  constructor(
    private readonly orchestration: AiOrchestrationService,
    private readonly contextBuilder: ContextBuilderService,
  ) {}

  /** Suggest adjustments to the user's next workout. */
  async suggestWorkoutAdjustment(
    context: WorkoutContextDto,
  ): Promise<WorkoutSuggestionDto> {
    const variables = this.contextBuilder.buildWorkoutVariables(context);
    const result = await this.orchestration.execute<WorkoutSuggestionDto>(
      AiCapability.WORKOUT_ADJUSTMENT,
      variables,
    );

    if (result.valid) return result.data;

    this.logger.warn(`Workout adjustment fallback triggered: ${result.reason}`);
    return this.workoutFallback();
  }

  /** Suggest alternative meals that fit the user's dietary needs. */
  async suggestMealSwap(
    context: MealContextDto,
  ): Promise<MealSwapSuggestionDto> {
    const variables = this.contextBuilder.buildMealVariables(context);
    const result = await this.orchestration.execute<MealSwapSuggestionDto>(
      AiCapability.MEAL_SWAP,
      variables,
    );

    if (result.valid) return result.data;

    this.logger.warn(`Meal swap fallback triggered: ${result.reason}`);
    return this.mealSwapFallback(context.currentMealName);
  }

  /** Explain progress trends in simple language. */
  async summarizeProgress(
    context: ProgressContextDto,
  ): Promise<ProgressSummaryDto> {
    const variables = this.contextBuilder.buildProgressVariables(context);
    const result = await this.orchestration.execute<ProgressSummaryDto>(
      AiCapability.PROGRESS_SUMMARY,
      variables,
    );

    if (result.valid) return result.data;

    this.logger.warn(`Progress summary fallback triggered: ${result.reason}`);
    return this.progressFallback();
  }

  /** Suggest recovery actions for a missed workout. */
  async suggestMissedWorkoutRecovery(
    context: MissedWorkoutContextDto,
  ): Promise<RecoverySuggestionDto> {
    const variables = this.contextBuilder.buildMissedWorkoutVariables(context);
    const result = await this.orchestration.execute<RecoverySuggestionDto>(
      AiCapability.MISSED_WORKOUT_RECOVERY,
      variables,
    );

    if (result.valid) return result.data;

    this.logger.warn(
      `Missed workout recovery fallback triggered: ${result.reason}`,
    );
    return this.recoveryFallback(context.missedWorkoutName);
  }

  /** Generate a motivational summary for the user. */
  async generateMotivationalSummary(
    context: MotivationalContextDto,
  ): Promise<MotivationalSummaryDto> {
    const variables = this.contextBuilder.buildMotivationalVariables(context);
    const result = await this.orchestration.execute<MotivationalSummaryDto>(
      AiCapability.MOTIVATIONAL_SUMMARY,
      variables,
    );

    if (result.valid) return result.data;

    this.logger.warn(
      `Motivational summary fallback triggered: ${result.reason}`,
    );
    return this.motivationalFallback();
  }

  // ── Deterministic fallbacks ──────────────────────────────────

  private workoutFallback(): WorkoutSuggestionDto {
    return {
      adjustmentType: 'maintain',
      reasoning:
        'Unable to generate AI suggestion. Continue with your current plan.',
      suggestedExercises: [],
      confidenceNote:
        'This is a default suggestion. AI analysis was unavailable.',
    };
  }

  private mealSwapFallback(originalMeal: string): MealSwapSuggestionDto {
    return {
      originalMeal,
      alternatives: [],
      disclaimer:
        'Unable to generate meal alternatives. Please consult your nutrition plan.',
    };
  }

  private progressFallback(): ProgressSummaryDto {
    return {
      trend: 'plateau',
      summary: 'Unable to generate AI progress analysis at this time.',
      keyInsight: 'Keep tracking your metrics for better insights.',
      suggestion: 'Continue your current routine and check back later.',
    };
  }

  private recoveryFallback(missedWorkout: string): RecoverySuggestionDto {
    return {
      strategy: 'skip_and_continue',
      reasoning:
        'Unable to generate AI recovery plan. The safest option is to continue your schedule.',
      adjustedSchedule: [
        { day: 'Next scheduled day', workoutName: missedWorkout },
      ],
      motivationalNote:
        'Missing one workout does not derail your progress. Stay consistent.',
    };
  }

  private motivationalFallback(): MotivationalSummaryDto {
    return {
      headline: 'Keep going!',
      body: 'Every workout counts. Stay consistent and trust the process.',
      callToAction: 'Check your plan for today and get moving.',
    };
  }
}
