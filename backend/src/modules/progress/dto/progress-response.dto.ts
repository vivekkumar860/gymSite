/** Shape of a progress entry response. */
export interface ProgressEntryResponseDto {
  id: string;
  metricType: string;
  recordedValue: number;
  recordedAt: string;
  notes: string | null;
}

/** Shape of a body measurement response. */
export interface BodyMeasurementResponseDto {
  id: string;
  site: string;
  valueCm: number;
  measuredAt: string;
  notes: string | null;
}

/** Shape of a progress photo response. */
export interface ProgressPhotoResponseDto {
  id: string;
  pose: string;
  storagePath: string;
  takenAt: string;
  notes: string | null;
}

/** Shape of the progress summary response. */
export interface ProgressSummaryResponseDto {
  totalWorkouts: number;
  latestBodyWeight: number | null;
  activeGoalsCount: number;
  currentHabitStreaks: { habitName: string; streak: number }[];
}

/** Per-day status within a weekly summary. */
export interface WeeklyDayStatusDto {
  date: string;
  dayLabel: string;
  workoutCompleted: boolean;
  habitsCompleted: number;
  habitsTotal: number;
}

/** Shape of the weekly overview response. */
export interface WeeklySummaryResponseDto {
  days: WeeklyDayStatusDto[];
  workoutsCompleted: number;
  workoutsPlanned: number;
}
