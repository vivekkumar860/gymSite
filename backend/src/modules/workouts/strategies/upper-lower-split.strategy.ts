import type {
  IWorkoutSplitStrategy,
  SplitDayDefinition,
} from './workout-split-strategy.interface';

const UPPER_DAY: Omit<SplitDayDefinition, 'dayOrder' | 'dayName'> = {
  focusArea: 'Upper Body',
  targetMuscleGroups: ['CHEST', 'BACK', 'SHOULDERS', 'BICEPS', 'TRICEPS'],
};

const LOWER_DAY: Omit<SplitDayDefinition, 'dayOrder' | 'dayName'> = {
  focusArea: 'Lower Body',
  targetMuscleGroups: ['QUADRICEPS', 'HAMSTRINGS', 'GLUTES', 'CALVES', 'CORE'],
};

/**
 * Upper/Lower split strategy.
 * Alternates between upper and lower body days.
 * Best for 4 days per week.
 */
export class UpperLowerSplitStrategy implements IWorkoutSplitStrategy {
  /** Generate alternating upper/lower days. */
  generateDays(daysPerWeek: number): SplitDayDefinition[] {
    return Array.from({ length: daysPerWeek }, (_, i) => {
      const isUpper = i % 2 === 0;
      const template = isUpper ? UPPER_DAY : LOWER_DAY;
      const label = isUpper ? 'Upper' : 'Lower';
      const number = Math.floor(i / 2) + 1;

      return {
        ...template,
        dayName: `${label} ${number}`,
        dayOrder: i + 1,
      };
    });
  }
}
