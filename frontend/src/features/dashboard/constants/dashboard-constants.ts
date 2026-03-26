// ---------------------------------------------------------------------------
// Dashboard query key namespace
// ---------------------------------------------------------------------------

export const DASHBOARD_QUERY_KEYS = {
  all: ["dashboard"] as const,
  todaysWorkout: () => ["dashboard", "todays-workout"] as const,
  calorieProgress: () => ["dashboard", "calorie-progress"] as const,
  proteinProgress: () => ["dashboard", "protein-progress"] as const,
  waterTarget: () => ["dashboard", "water-target"] as const,
  sleepSummary: () => ["dashboard", "sleep-summary"] as const,
  habitsChecklist: () => ["dashboard", "habits-checklist"] as const,
  streakCount: () => ["dashboard", "streak-count"] as const,
  weightTrend: () => ["dashboard", "weight-trend"] as const,
  weeklySummary: () => ["dashboard", "weekly-summary"] as const,
} as const;

// ---------------------------------------------------------------------------
// Dashboard display constants
// ---------------------------------------------------------------------------

export const WEIGHT_TREND_DAYS = 14;
export const WEEKLY_SUMMARY_DAYS = 7;
export const DEFAULT_WATER_TARGET_ML = 2500;
export const DEFAULT_SLEEP_TARGET_HOURS = 8;
export const WATER_LOG_INCREMENT_ML = 250;

// ---------------------------------------------------------------------------
// Section labels
// ---------------------------------------------------------------------------

export const SECTION_LABELS = {
  todaysWorkout: "Today's Workout",
  calorieProgress: "Calorie Target",
  proteinProgress: "Protein Target",
  waterTarget: "Water Intake",
  sleepSummary: "Sleep Summary",
  habitsChecklist: "Habits",
  streakCount: "Streak",
  weightTrend: "Weight Trend",
  weeklySummary: "Weekly Overview",
} as const;
