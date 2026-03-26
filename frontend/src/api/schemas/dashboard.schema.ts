import { z } from "zod";

// ---------------------------------------------------------------------------
// Water Target
// ---------------------------------------------------------------------------

export const waterLogEntrySchema = z.object({
  time: z.string(),
  amountMl: z.number(),
});

export const waterTargetSchema = z.object({
  currentMl: z.number(),
  targetMl: z.number(),
  logs: z.array(waterLogEntrySchema),
});

export type WaterTargetResponse = z.infer<typeof waterTargetSchema>;

// ---------------------------------------------------------------------------
// Sleep Summary
// ---------------------------------------------------------------------------

export const sleepSummarySchema = z.object({
  hoursSlept: z.number(),
  targetHours: z.number(),
  quality: z.enum(["poor", "fair", "good", "excellent"]),
  bedtime: z.string().nullable(),
  wakeTime: z.string().nullable(),
});

export type SleepSummaryResponse = z.infer<typeof sleepSummarySchema>;

// ---------------------------------------------------------------------------
// Streak Count
// ---------------------------------------------------------------------------

export const streakCountSchema = z.object({
  currentStreak: z.number(),
  longestStreak: z.number(),
});

export type StreakCountResponse = z.infer<typeof streakCountSchema>;

// ---------------------------------------------------------------------------
// Weight Trend
// ---------------------------------------------------------------------------

export const weightTrendEntrySchema = z.object({
  date: z.string(),
  weight: z.number(),
});

export const weightTrendSchema = z.object({
  entries: z.array(weightTrendEntrySchema),
  currentWeight: z.number().nullable(),
  changeFromLast: z.number().nullable(),
  unit: z.enum(["kg", "lbs"]),
});

export type WeightTrendResponse = z.infer<typeof weightTrendSchema>;

// ---------------------------------------------------------------------------
// Weekly Summary
// ---------------------------------------------------------------------------

export const weeklyDayStatusSchema = z.object({
  date: z.string(),
  dayLabel: z.string(),
  workoutCompleted: z.boolean(),
  habitsCompleted: z.number(),
  habitsTotal: z.number(),
});

export const weeklySummarySchema = z.object({
  days: z.array(weeklyDayStatusSchema),
  workoutsCompleted: z.number(),
  workoutsPlanned: z.number(),
});

export type WeeklySummaryResponse = z.infer<typeof weeklySummarySchema>;
