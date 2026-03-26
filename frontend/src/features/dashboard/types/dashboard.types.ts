import type { Workout } from "@/api/schemas/workout.schema";
import type { HabitWithStreak } from "@/api/schemas/habits.schema";

// ---------------------------------------------------------------------------
// Today's Workout
// ---------------------------------------------------------------------------

export type TodaysWorkoutData = {
  workout: Workout | null;
};

// ---------------------------------------------------------------------------
// Nutrient Progress (shared by calories & protein)
// ---------------------------------------------------------------------------

export type NutrientProgressData = {
  current: number;
  target: number;
  unit: string;
};

// ---------------------------------------------------------------------------
// Water Target
// ---------------------------------------------------------------------------

export type WaterTargetData = {
  currentMl: number;
  targetMl: number;
  logs: { time: string; amountMl: number }[];
};

// ---------------------------------------------------------------------------
// Sleep Summary
// ---------------------------------------------------------------------------

export type SleepSummaryData = {
  hoursSlept: number;
  targetHours: number;
  quality: "poor" | "fair" | "good" | "excellent";
  bedtime: string | null;
  wakeTime: string | null;
};

// ---------------------------------------------------------------------------
// Habits Checklist
// ---------------------------------------------------------------------------

export type HabitChecklistItem = HabitWithStreak & {
  completedToday: boolean;
};

export type HabitsChecklistData = {
  habits: HabitChecklistItem[];
};

// ---------------------------------------------------------------------------
// Streak Count
// ---------------------------------------------------------------------------

export type StreakCountData = {
  currentStreak: number;
  longestStreak: number;
};

// ---------------------------------------------------------------------------
// Weight Trend
// ---------------------------------------------------------------------------

export type WeightTrendEntry = {
  date: string;
  weight: number;
};

export type WeightTrendData = {
  entries: WeightTrendEntry[];
  currentWeight: number | null;
  changeFromLast: number | null;
  unit: "kg" | "lbs";
};

// ---------------------------------------------------------------------------
// Weekly Completion Summary
// ---------------------------------------------------------------------------

export type WeeklyDayStatus = {
  date: string;
  dayLabel: string;
  workoutCompleted: boolean;
  habitsCompleted: number;
  habitsTotal: number;
};

export type WeeklySummaryData = {
  days: WeeklyDayStatus[];
  workoutsCompleted: number;
  workoutsPlanned: number;
};

// ---------------------------------------------------------------------------
// Aggregated Dashboard Stats
// ---------------------------------------------------------------------------

export type DashboardStats = {
  todayWorkoutStatus: string;
  weeklyWorkoutCount: number;
  currentStreak: number;
  caloriesConsumed: number;
  caloriesTarget: number;
  activeGoalsCount: number;
  habitsCompletedToday: number;
  habitsTotalToday: number;
};
