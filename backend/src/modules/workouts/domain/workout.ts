/** Domain representation of a workout plan. */
export interface WorkoutPlanDomain {
  id: string;
  userId: string;
  planName: string;
  description: string | null;
  planStatus: string;
  goalId: string | null;
  durationWeeks: number | null;
  daysPerWeek: number;
  createdAt: Date;
  updatedAt: Date;
}

/** Domain representation of a workout day within a plan. */
export interface WorkoutDayDomain {
  id: string;
  planId: string;
  dayName: string;
  dayOrder: number;
  focusArea: string | null;
  scheduledDate: Date | null;
}

/** Domain representation of a day with its exercises (detail view). */
export interface WorkoutDayDetailDomain {
  id: string;
  planId: string;
  dayName: string;
  dayOrder: number;
  focusArea: string | null;
  scheduledDate: Date | null;
  exercises: WorkoutDayExerciseDomain[];
}

/** Domain representation of a prescribed exercise within a workout day. */
export interface WorkoutDayExerciseDomain {
  id: string;
  dayId: string;
  exerciseId: string;
  exerciseName: string;
  exerciseOrder: number;
  targetSets: number;
  targetRepsMin: number;
  targetRepsMax: number;
  restSeconds: number;
  notes: string | null;
}

/** Domain representation of a gym session. */
export interface WorkoutSessionDomain {
  id: string;
  userId: string;
  dayId: string | null;
  sessionStatus: string;
  startedAt: Date;
  completedAt: Date | null;
  notes: string | null;
  rating: number | null;
  /** Populated when set logs are included in the query. */
  exerciseCount?: number;
  totalSets?: number;
  totalVolume?: number;
}

/** Domain representation of a single logged set. */
export interface WorkoutSetLogDomain {
  id: string;
  sessionId: string;
  exerciseId: string;
  setNumber: number;
  weightKg: number | null;
  repsCompleted: number;
  rpe: number | null;
  isWarmup: boolean;
  isFailure: boolean;
}
