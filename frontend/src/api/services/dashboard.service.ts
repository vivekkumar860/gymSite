import { z } from "zod";
import { apiClient, ApiError } from "@/api/client";
import { getTodayWorkout } from "./workout.service";
import { getDailyNutrition as fetchDailyNutrition } from "./nutrition.service";
import type { Workout } from "@/api/schemas/workout.schema";
import type { DailyNutrition } from "@/api/schemas/nutrition.schema";
import type {
  WaterTargetResponse,
  SleepSummaryResponse,
  StreakCountResponse,
  WeightTrendResponse,
  WeeklySummaryResponse,
} from "@/api/schemas/dashboard.schema";
import type { HabitWithStreak } from "@/api/schemas/habits.schema";

// ---------------------------------------------------------------------------
// Backend habit schema (matches HabitResponseDto)
// ---------------------------------------------------------------------------

const habitResponseSchema = z.object({
  id: z.string(),
  habitName: z.string(),
  frequency: z.string(),
  targetValue: z.number().nullable(),
  unitLabel: z.string().nullable(),
  isActive: z.boolean(),
  colorHex: z.string().nullable(),
  currentStreak: z.number(),
  longestStreak: z.number(),
});

// ---------------------------------------------------------------------------
// Dashboard Service — delegates to real backend endpoints where available
// ---------------------------------------------------------------------------

export async function getTodaysWorkout(): Promise<Workout | null> {
  return getTodayWorkout();
}

export async function getDailyNutrition(
  date: string,
): Promise<DailyNutrition | null> {
  try {
    return await fetchDailyNutrition(date);
  } catch {
    return null;
  }
}

// Water / sleep tracking — no backend model exists yet
export async function getWaterTarget(
  _date: string,
): Promise<WaterTargetResponse | null> {
  return null;
}

export async function logWater(
  _amountMl: number,
): Promise<WaterTargetResponse | null> {
  return null;
}

export async function getSleepSummary(
  _date: string,
): Promise<SleepSummaryResponse | null> {
  return null;
}

// ---------------------------------------------------------------------------
// Habits — wired to GET /habits
// ---------------------------------------------------------------------------

export async function getHabitsChecklist(): Promise<HabitWithStreak[]> {
  try {
    const habits = await apiClient.get(
      "/habits",
      z.array(habitResponseSchema),
    );

    return habits.map((h) => ({
      id: h.id,
      name: h.habitName,
      frequency:
        h.frequency === "WEEKLY" ? ("weekly" as const) : ("daily" as const),
      targetCount: h.targetValue ?? 1,
      color: h.colorHex ?? undefined,
      createdAt: new Date().toISOString(),
      currentStreak: h.currentStreak,
      longestStreak: h.longestStreak,
      completionRate: 0,
    }));
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) return [];
    return [];
  }
}

// ---------------------------------------------------------------------------
// Streaks — derived from habits endpoint
// ---------------------------------------------------------------------------

export async function getStreakCount(): Promise<StreakCountResponse> {
  try {
    const habits = await getHabitsChecklist();
    const current = Math.max(0, ...habits.map((h) => h.currentStreak));
    const longest = Math.max(0, ...habits.map((h) => h.longestStreak));
    return { currentStreak: current, longestStreak: longest };
  } catch {
    return { currentStreak: 0, longestStreak: 0 };
  }
}

// ---------------------------------------------------------------------------
// Weight trend — wired to GET /progress/entries?metricType=BODY_WEIGHT
// ---------------------------------------------------------------------------

const progressEntrySchema = z.object({
  id: z.string(),
  metricType: z.string(),
  recordedValue: z.number(),
  recordedAt: z.string(),
  notes: z.string().nullable(),
});

export async function getWeightTrend(
  days: number,
): Promise<WeightTrendResponse> {
  try {
    const entries = await apiClient.get(
      "/progress/entries",
      z.array(progressEntrySchema),
      { metricType: "BODY_WEIGHT", limit: days },
    );

    if (entries.length === 0) {
      return {
        entries: [],
        currentWeight: null,
        changeFromLast: null,
        unit: "kg",
      };
    }

    // Backend returns newest first; reverse for chart display (oldest→newest)
    const sorted = [...entries].reverse();

    const currentWeight = entries[0].recordedValue;
    const changeFromLast =
      entries.length >= 2
        ? Math.round((entries[0].recordedValue - entries[1].recordedValue) * 10) / 10
        : null;

    return {
      entries: sorted.map((e) => ({
        date: e.recordedAt,
        weight: e.recordedValue,
      })),
      currentWeight,
      changeFromLast,
      unit: "kg",
    };
  } catch {
    return {
      entries: [],
      currentWeight: null,
      changeFromLast: null,
      unit: "kg",
    };
  }
}

// ---------------------------------------------------------------------------
// Weekly summary — wired to GET /progress/weekly-summary
// ---------------------------------------------------------------------------

import { weeklySummarySchema } from "@/api/schemas/dashboard.schema";

export async function getWeeklySummary(): Promise<WeeklySummaryResponse | null> {
  try {
    return await apiClient.get("/progress/weekly-summary", weeklySummarySchema);
  } catch {
    return null;
  }
}
