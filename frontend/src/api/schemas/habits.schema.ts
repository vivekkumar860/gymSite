import { z } from "zod";

// ---------------------------------------------------------------------------
// Habit
// ---------------------------------------------------------------------------

export const habitSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  frequency: z.enum(["daily", "weekly"]),
  targetCount: z.number(),
  color: z.string().optional(),
  icon: z.string().optional(),
  createdAt: z.string(),
});

export type Habit = z.infer<typeof habitSchema>;

// ---------------------------------------------------------------------------
// Habit Log
// ---------------------------------------------------------------------------

export const habitLogSchema = z.object({
  id: z.string(),
  habitId: z.string(),
  date: z.string(),
  completed: z.boolean(),
  count: z.number(),
  notes: z.string().optional(),
});

export type HabitLog = z.infer<typeof habitLogSchema>;

// ---------------------------------------------------------------------------
// Habit with Streak
// ---------------------------------------------------------------------------

export const habitWithStreakSchema = habitSchema.extend({
  currentStreak: z.number(),
  longestStreak: z.number(),
  completionRate: z.number(),
});

export type HabitWithStreak = z.infer<typeof habitWithStreakSchema>;
