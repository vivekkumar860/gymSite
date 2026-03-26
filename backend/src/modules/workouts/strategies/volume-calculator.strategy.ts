/** Strategy interface for calculating workout volume based on set logs. */
export interface VolumeCalculatorStrategy {
  /** Calculate total volume for a list of sets. */
  calculateVolume(sets: SetData[]): number;
}

export interface SetData {
  weightKg: number | null;
  repsCompleted: number;
  isWarmup: boolean;
}

/**
 * Standard volume calculation: sum of (weight x reps) for working sets.
 * Used for strength and hypertrophy workouts.
 */
export class WeightedVolumeStrategy implements VolumeCalculatorStrategy {
  calculateVolume(sets: SetData[]): number {
    return sets
      .filter((s) => !s.isWarmup)
      .reduce((total, s) => total + (s.weightKg ?? 0) * s.repsCompleted, 0);
  }
}

/**
 * Bodyweight volume calculation: sum of reps for working sets.
 * Used when exercises have no external weight.
 */
export class BodyweightVolumeStrategy implements VolumeCalculatorStrategy {
  calculateVolume(sets: SetData[]): number {
    return sets
      .filter((s) => !s.isWarmup)
      .reduce((total, s) => total + s.repsCompleted, 0);
  }
}
