/** Configuration for sets, reps, and rest based on training goal. */
export interface RepScheme {
  targetSets: number;
  targetRepsMin: number;
  targetRepsMax: number;
  restSeconds: number;
  compoundRestSeconds: number;
}

const STRENGTH_SCHEME: RepScheme = {
  targetSets: 5,
  targetRepsMin: 3,
  targetRepsMax: 5,
  restSeconds: 120,
  compoundRestSeconds: 180,
};

const HYPERTROPHY_SCHEME: RepScheme = {
  targetSets: 4,
  targetRepsMin: 8,
  targetRepsMax: 12,
  restSeconds: 60,
  compoundRestSeconds: 90,
};

const ENDURANCE_SCHEME: RepScheme = {
  targetSets: 3,
  targetRepsMin: 15,
  targetRepsMax: 20,
  restSeconds: 30,
  compoundRestSeconds: 45,
};

const MAINTENANCE_SCHEME: RepScheme = {
  targetSets: 3,
  targetRepsMin: 8,
  targetRepsMax: 12,
  restSeconds: 60,
  compoundRestSeconds: 90,
};

const GOAL_TO_SCHEME: Record<string, RepScheme> = {
  INCREASE_STRENGTH: STRENGTH_SCHEME,
  GAIN_MUSCLE: HYPERTROPHY_SCHEME,
  LOSE_WEIGHT: ENDURANCE_SCHEME,
  IMPROVE_ENDURANCE: ENDURANCE_SCHEME,
  MAINTAIN: MAINTENANCE_SCHEME,
};

/** Resolve the rep/set scheme for a given training goal. */
export function resolveRepScheme(goal: string): RepScheme {
  return GOAL_TO_SCHEME[goal] ?? MAINTENANCE_SCHEME;
}
