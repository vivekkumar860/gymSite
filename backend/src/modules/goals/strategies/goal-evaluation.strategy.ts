import type { GoalDomain } from '../domain/goal';

/** Strategy interface for evaluating goal progress. */
export interface GoalEvaluationStrategy {
  /** Determine if the goal should be marked as achieved based on current state. */
  isAchieved(goal: GoalDomain): boolean;
}

/** Weight loss: achieved when current <= target (weight goes down). */
export class WeightLossEvaluationStrategy implements GoalEvaluationStrategy {
  isAchieved(goal: GoalDomain): boolean {
    if (!goal.currentValue || !goal.targetValue) return false;
    return goal.currentValue <= goal.targetValue;
  }
}

/** Muscle gain / strength: achieved when current >= target (value goes up). */
export class GainEvaluationStrategy implements GoalEvaluationStrategy {
  isAchieved(goal: GoalDomain): boolean {
    if (!goal.currentValue || !goal.targetValue) return false;
    return goal.currentValue >= goal.targetValue;
  }
}

/** Maintenance: achieved when current is within 5% of target. */
export class MaintenanceEvaluationStrategy implements GoalEvaluationStrategy {
  private static readonly TOLERANCE_PCT = 0.05;

  isAchieved(goal: GoalDomain): boolean {
    if (!goal.currentValue || !goal.targetValue) return false;
    const diff = Math.abs(goal.currentValue - goal.targetValue);
    return (
      diff <= goal.targetValue * MaintenanceEvaluationStrategy.TOLERANCE_PCT
    );
  }
}

/** Custom goals: no automatic evaluation. */
export class CustomGoalEvaluationStrategy implements GoalEvaluationStrategy {
  isAchieved(): boolean {
    return false;
  }
}

/** Resolves the correct strategy for a goal type. */
export function resolveGoalStrategy(goalType: string): GoalEvaluationStrategy {
  const strategies: Record<string, GoalEvaluationStrategy> = {
    LOSE_WEIGHT: new WeightLossEvaluationStrategy(),
    GAIN_MUSCLE: new GainEvaluationStrategy(),
    INCREASE_STRENGTH: new GainEvaluationStrategy(),
    IMPROVE_ENDURANCE: new GainEvaluationStrategy(),
    MAINTAIN: new MaintenanceEvaluationStrategy(),
    CUSTOM: new CustomGoalEvaluationStrategy(),
  };

  return strategies[goalType] ?? new CustomGoalEvaluationStrategy();
}
