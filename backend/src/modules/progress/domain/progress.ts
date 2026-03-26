/** Domain representation of a progress scalar entry. */
export interface ProgressEntryDomain {
  id: string;
  userId: string;
  metricType: string;
  recordedValue: number;
  recordedAt: Date;
  notes: string | null;
}

/** Domain representation of a body measurement. */
export interface BodyMeasurementDomain {
  id: string;
  userId: string;
  site: string;
  valueCm: number;
  measuredAt: Date;
  notes: string | null;
}

/** Domain representation of a progress photo. */
export interface ProgressPhotoDomain {
  id: string;
  userId: string;
  pose: string;
  storagePath: string;
  takenAt: Date;
  notes: string | null;
}

/** Aggregated progress summary across modules. */
export interface ProgressSummary {
  totalWorkouts: number;
  latestBodyWeight: number | null;
  activeGoalsCount: number;
  currentHabitStreaks: { habitName: string; streak: number }[];
  recentMeasurements: BodyMeasurementDomain[];
}
