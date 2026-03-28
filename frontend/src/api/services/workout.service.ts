import { z } from "zod";
import { apiClient, ApiError, type QueryParams } from "@/api/client";
import {
  exerciseSetSchema,
  type Workout,
  type WorkoutExercise,
  type ExerciseSet,
} from "@/api/schemas/workout.schema";

// ---------------------------------------------------------------------------
// Backend Zod schemas (match the actual DTOs returned by the NestJS API)
// ---------------------------------------------------------------------------

const workoutPlanSchema = z.object({
  id: z.string(),
  planName: z.string(),
  description: z.string().nullable(),
  planStatus: z.string(),
  goalId: z.string().nullable(),
  durationWeeks: z.number().nullable(),
  daysPerWeek: z.number(),
  createdAt: z.string(),
});

const workoutDayExerciseSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  exerciseName: z.string(),
  exerciseOrder: z.number(),
  targetSets: z.number(),
  targetRepsMin: z.number(),
  targetRepsMax: z.number(),
  restSeconds: z.number(),
  notes: z.string().nullable(),
});

const workoutDayDetailSchema = z.object({
  id: z.string(),
  dayName: z.string(),
  dayOrder: z.number(),
  focusArea: z.string().nullable(),
  scheduledDate: z.string().nullable(),
  exercises: z.array(workoutDayExerciseSchema),
});

const workoutDaySchema = z.object({
  id: z.string(),
  dayName: z.string(),
  dayOrder: z.number(),
  focusArea: z.string().nullable(),
  scheduledDate: z.string().nullable(),
});

const workoutSessionSchema = z.object({
  id: z.string(),
  dayId: z.string().nullable(),
  sessionStatus: z.string(),
  startedAt: z.string(),
  completedAt: z.string().nullable(),
  notes: z.string().nullable(),
  rating: z.number().nullable(),
  exerciseCount: z.number(),
  totalSets: z.number(),
  totalVolume: z.number(),
});

type BackendDayDetail = z.infer<typeof workoutDayDetailSchema>;
type BackendSession = z.infer<typeof workoutSessionSchema>;

// ---------------------------------------------------------------------------
// Workout Service — wired to real backend endpoints
// ---------------------------------------------------------------------------

/**
 * Build a frontend Workout object from the active plan's "today" day.
 *
 * Strategy:
 *   1. Fetch the active plan
 *   2. Fetch its days
 *   3. Find the day matching today's date, or fall back to dayOrder mod weekday
 *   4. Fetch day detail (with exercises)
 *   5. Look for an in-progress session for that day
 *   6. If session exists, fetch its logged sets
 *   7. Compose into the frontend Workout shape
 */
export async function getTodayWorkout(): Promise<Workout | null> {
  try {
    // 1. Active plan
    const plan = await apiClient.get(
      "/workout-plans/active",
      workoutPlanSchema,
    );

    // 2. Plan days
    const days = await apiClient.get(
      `/workout-plans/${plan.id}/days`,
      z.array(workoutDaySchema),
    );
    if (days.length === 0) return null;

    // 3. Find today's day by scheduledDate, else by dayOrder
    const todayStr = new Date().toISOString().split("T")[0];
    let targetDay = days.find((d) => d.scheduledDate === todayStr);
    if (!targetDay) {
      const dayOfWeek = new Date().getDay(); // 0=Sun, 1=Mon …
      const idx = dayOfWeek === 0 ? days.length - 1 : (dayOfWeek - 1) % days.length;
      targetDay = days[idx];
    }
    if (!targetDay) return null;

    // 4. Day detail with exercises
    const dayDetail = await apiClient.get(
      `/workout-plans/days/${targetDay.id}`,
      workoutDayDetailSchema,
    );

    // 5. Check for existing session for this day
    const sessions = await apiClient.get(
      "/workout-sessions",
      z.array(workoutSessionSchema),
      { limit: 5 } as QueryParams,
    );
    const session = sessions.find(
      (s) =>
        s.dayId === targetDay!.id &&
        (s.sessionStatus === "IN_PROGRESS" || s.sessionStatus === "COMPLETED"),
    );

    // 6. If session exists, get its sets
    let sets: ExerciseSet[] = [];
    if (session) {
      sets = await apiClient.get(
        `/workout-sessions/${session.id}/sets`,
        z.array(exerciseSetSchema),
      );
    }

    // 7. Compose
    return composeFrontendWorkout(dayDetail, session ?? null, sets);
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) return null;
    throw err;
  }
}

function composeFrontendWorkout(
  day: BackendDayDetail,
  session: BackendSession | null,
  sets: ExerciseSet[],
): Workout {
  const exercises: WorkoutExercise[] = day.exercises
    .sort((a, b) => a.exerciseOrder - b.exerciseOrder)
    .map((ex) => ({
      id: ex.id,
      exerciseId: ex.exerciseId,
      exerciseName: ex.exerciseName,
      sets: sets.filter((s) => s.exerciseId === ex.exerciseId),
      order: ex.exerciseOrder,
      notes: ex.notes ?? undefined,
    }));

  let status: Workout["status"] = "planned";
  if (session?.sessionStatus === "IN_PROGRESS") status = "in_progress";
  else if (session?.sessionStatus === "COMPLETED") status = "completed";

  return {
    id: session?.id ?? day.id,
    name: day.dayName,
    date: day.scheduledDate ?? new Date().toISOString().split("T")[0],
    status,
    exercises,
    startedAt: session?.startedAt,
    completedAt: session?.completedAt ?? undefined,
    notes: session?.notes ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// Session management
// ---------------------------------------------------------------------------

export async function startWorkout(dayId: string): Promise<Workout> {
  const session = await apiClient.post(
    "/workout-sessions",
    { dayId },
    workoutSessionSchema,
  );
  // Re-fetch the full "today" view so we get the complete Workout shape
  const result = await getTodayWorkout();
  return result!;
}

export async function completeWorkout(sessionId: string): Promise<Workout> {
  await apiClient.post(
    `/workout-sessions/${sessionId}/complete`,
    {},
    workoutSessionSchema,
  );
  const result = await getTodayWorkout();
  return result!;
}

// ---------------------------------------------------------------------------
// Set logging
// ---------------------------------------------------------------------------

export async function logSet(
  sessionId: string,
  data: {
    exerciseId: string;
    setNumber: number;
    weightKg?: number;
    repsCompleted: number;
    rpe?: number;
    isWarmup?: boolean;
    isFailure?: boolean;
  },
): Promise<ExerciseSet> {
  return apiClient.post(
    `/workout-sessions/${sessionId}/sets`,
    data,
    exerciseSetSchema,
  );
}

// ---------------------------------------------------------------------------
// History — maps backend sessions to the WorkoutSummary the UI expects
// ---------------------------------------------------------------------------

import type { WorkoutSummary } from "@/api/schemas/workout.schema";

const sessionHistorySchema = z.object({
  data: z.array(workoutSessionSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    totalCount: z.number(),
    totalPages: z.number(),
  }),
});

function sessionToSummary(s: BackendSession): WorkoutSummary {
  const statusMap: Record<string, WorkoutSummary["status"]> = {
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    CANCELLED: "skipped",
  };
  return {
    id: s.id,
    name: s.notes ?? "Workout Session",
    date: s.startedAt.split("T")[0],
    status: statusMap[s.sessionStatus] ?? "planned",
    exerciseCount: s.exerciseCount,
    totalSets: s.totalSets,
    totalVolume: s.totalVolume,
    duration: s.completedAt
      ? Math.round(
          (new Date(s.completedAt).getTime() -
            new Date(s.startedAt).getTime()) /
            60_000,
        )
      : undefined,
  };
}

export async function getWorkoutHistory(
  params: { page?: number; limit?: number } = {},
): Promise<{
  data: WorkoutSummary[];
  meta: { page: number; limit: number; totalCount: number; totalPages: number };
}> {
  const result = await apiClient.get(
    "/workout-sessions/history",
    sessionHistorySchema,
    params as QueryParams,
  );
  return {
    data: result.data.map(sessionToSummary),
    meta: result.meta,
  };
}

export async function getWorkoutById(id: string): Promise<Workout> {
  const session = await apiClient.get(
    `/workout-sessions/${id}`,
    workoutSessionSchema,
  );

  // Fetch sets for this session
  const sets = await apiClient.get(
    `/workout-sessions/${id}/sets`,
    z.array(exerciseSetSchema),
  );

  // If session has a dayId, fetch the day detail for exercise info
  let dayDetail: BackendDayDetail | null = null;
  if (session.dayId) {
    try {
      dayDetail = await apiClient.get(
        `/workout-plans/days/${session.dayId}`,
        workoutDayDetailSchema,
      );
    } catch {
      // Day may have been deleted
    }
  }

  if (dayDetail) {
    return composeFrontendWorkout(dayDetail, session, sets);
  }

  // Fallback: build from sets alone (ad-hoc session without a plan day)
  const exerciseIds = [...new Set(sets.map((s) => s.exerciseId))];
  const exercises: WorkoutExercise[] = exerciseIds.map((eid, i) => ({
    id: eid,
    exerciseId: eid,
    exerciseName: "Unknown Exercise",
    sets: sets.filter((s) => s.exerciseId === eid),
    order: i + 1,
  }));

  const statusMap: Record<string, Workout["status"]> = {
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    CANCELLED: "skipped",
  };

  return {
    id: session.id,
    name: session.notes ?? "Workout Session",
    date: session.startedAt.split("T")[0],
    status: statusMap[session.sessionStatus] ?? "planned",
    exercises,
    startedAt: session.startedAt,
    completedAt: session.completedAt ?? undefined,
    notes: session.notes ?? undefined,
  };
}

export async function deleteSet(sessionId: string, setId: string): Promise<void> {
  return apiClient.delete(`/workout-sessions/${sessionId}/sets/${setId}`);
}

// ---------------------------------------------------------------------------
// Plan generation
// ---------------------------------------------------------------------------

import type { GeneratePlanFormValues } from "@/features/workout/schemas/generate-plan-schema";

export type WorkoutPlanResponse = z.infer<typeof workoutPlanSchema>;

export async function generateWorkoutPlan(
  data: GeneratePlanFormValues,
): Promise<WorkoutPlanResponse> {
  return apiClient.post("/workout-plans/generate", data, workoutPlanSchema);
}
