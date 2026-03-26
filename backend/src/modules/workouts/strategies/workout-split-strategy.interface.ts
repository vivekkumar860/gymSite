/** A single day definition produced by a split strategy. */
export interface SplitDayDefinition {
  dayName: string;
  dayOrder: number;
  focusArea: string;
  targetMuscleGroups: string[];
}

/**
 * Strategy interface for determining how training days are structured.
 * Each implementation produces a different split pattern (PPL, Upper/Lower, Full Body).
 */
export interface IWorkoutSplitStrategy {
  /** Generate the day definitions for a given number of training days per week. */
  generateDays(daysPerWeek: number): SplitDayDefinition[];
}
