/** Shape of a workout plan response. */
export interface WorkoutPlanResponseDto {
  id: string;
  planName: string;
  description: string | null;
  planStatus: string;
  goalId: string | null;
  durationWeeks: number | null;
  daysPerWeek: number;
  createdAt: string;
}

/** Shape of a workout day response. */
export interface WorkoutDayResponseDto {
  id: string;
  dayName: string;
  dayOrder: number;
  focusArea: string | null;
  scheduledDate: string | null;
}

/** Shape of a workout day with its exercises (detail view). */
export interface WorkoutDayDetailResponseDto {
  id: string;
  dayName: string;
  dayOrder: number;
  focusArea: string | null;
  scheduledDate: string | null;
  exercises: WorkoutDayExerciseResponseDto[];
}

/** Shape of a workout day exercise response. */
export interface WorkoutDayExerciseResponseDto {
  id: string;
  exerciseId: string;
  exerciseName: string;
  exerciseOrder: number;
  targetSets: number;
  targetRepsMin: number;
  targetRepsMax: number;
  restSeconds: number;
  notes: string | null;
}

/** Shape of a workout session response. */
export interface WorkoutSessionResponseDto {
  id: string;
  dayId: string | null;
  sessionStatus: string;
  startedAt: string;
  completedAt: string | null;
  notes: string | null;
  rating: number | null;
  exerciseCount: number;
  totalSets: number;
  totalVolume: number;
}

/** Shape of a set log response. */
export interface WorkoutSetLogResponseDto {
  id: string;
  exerciseId: string;
  setNumber: number;
  weightKg: number | null;
  repsCompleted: number;
  rpe: number | null;
  isWarmup: boolean;
  isFailure: boolean;
}
