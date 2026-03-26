import type {
  IWorkoutSplitStrategy,
  SplitDayDefinition,
} from './workout-split-strategy.interface';

const ALL_MAJOR_MUSCLE_GROUPS = [
  'CHEST',
  'BACK',
  'SHOULDERS',
  'QUADRICEPS',
  'HAMSTRINGS',
  'GLUTES',
  'CORE',
];

/**
 * Full body split strategy.
 * Every day targets all major muscle groups.
 * Best for 2–3 days per week (beginners or general fitness).
 */
export class FullBodySplitStrategy implements IWorkoutSplitStrategy {
  /** Generate full body days with emphasis labels. */
  generateDays(daysPerWeek: number): SplitDayDefinition[] {
    return Array.from({ length: daysPerWeek }, (_, i) => ({
      dayName: `Full Body ${i + 1}`,
      dayOrder: i + 1,
      focusArea: 'Full Body',
      targetMuscleGroups: ALL_MAJOR_MUSCLE_GROUPS,
    }));
  }
}
