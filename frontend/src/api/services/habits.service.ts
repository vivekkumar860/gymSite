import { apiClient } from "@/api/client";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Schemas matching backend HabitResponseDto / HabitEntryResponseDto
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

const habitEntryResponseSchema = z.object({
  id: z.string(),
  habitId: z.string(),
  entryDate: z.string(),
  isCompleted: z.boolean(),
  recordedValue: z.number().nullable(),
  notes: z.string().nullable(),
});

export type HabitResponse = z.infer<typeof habitResponseSchema>;
export type HabitEntryResponse = z.infer<typeof habitEntryResponseSchema>;

const habitsListSchema = z.array(habitResponseSchema);

// ---------------------------------------------------------------------------
// Habits Service
// ---------------------------------------------------------------------------

export async function getHabits(): Promise<HabitResponse[]> {
  return apiClient.get("/habits", habitsListSchema);
}

export async function createHabit(data: {
  habitName: string;
  frequency: string;
  targetValue?: number;
  unitLabel?: string;
  colorHex?: string;
}): Promise<HabitResponse> {
  return apiClient.post("/habits", data, habitResponseSchema);
}

export async function updateHabit(
  id: string,
  data: Partial<{ habitName: string; frequency: string; targetValue: number; unitLabel: string; isActive: boolean; colorHex: string }>,
): Promise<HabitResponse> {
  return apiClient.patch(`/habits/${id}`, data, habitResponseSchema);
}

export async function deleteHabit(id: string): Promise<void> {
  await apiClient.delete(`/habits/${id}`);
}

export async function logHabitCompletion(
  habitId: string,
  data: { date: string; completed: boolean; count: number },
): Promise<HabitEntryResponse> {
  return apiClient.post(
    `/habits/${habitId}/entries`,
    {
      entryDate: data.date,
      isCompleted: data.completed,
      recordedValue: data.count,
    },
    habitEntryResponseSchema,
  );
}

export async function getHabitStreaks(): Promise<HabitResponse[]> {
  return getHabits();
}

export async function getTodayEntries(
  habitIds: string[],
): Promise<HabitEntryResponse[]> {
  const today = new Date().toISOString().split("T")[0];
  const entries: HabitEntryResponse[] = [];
  for (const habitId of habitIds) {
    try {
      const result = await apiClient.get(
        `/habits/${habitId}/entries`,
        z.array(habitEntryResponseSchema),
        { from: today, to: today },
      );
      entries.push(...result);
    } catch {
      // Skip individual failures
    }
  }
  return entries;
}
