import type { IWorkoutSplitStrategy } from './workout-split-strategy.interface';
import { PushPullLegsSplitStrategy } from './push-pull-legs-split.strategy';
import { UpperLowerSplitStrategy } from './upper-lower-split.strategy';
import { FullBodySplitStrategy } from './full-body-split.strategy';

const FULL_BODY_MAX_DAYS = 3;
const UPPER_LOWER_MAX_DAYS = 4;

/**
 * Resolves the appropriate workout split strategy based on training frequency and goal.
 * Pure function — no dependencies, fully testable.
 */
export function resolveSplitStrategy(
  daysPerWeek: number,
  goal: string,
): IWorkoutSplitStrategy {
  if (daysPerWeek <= FULL_BODY_MAX_DAYS && goal !== 'GAIN_MUSCLE') {
    return new FullBodySplitStrategy();
  }

  if (daysPerWeek <= UPPER_LOWER_MAX_DAYS) {
    return new UpperLowerSplitStrategy();
  }

  return new PushPullLegsSplitStrategy();
}
