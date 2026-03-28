import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTodayWorkout, generateWorkoutPlan } from "../workout.service";
import { clearTokens, storeTokens } from "../../client";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const PLAN = {
  id: "plan-1",
  planName: "Push Pull Legs",
  description: null,
  planStatus: "ACTIVE",
  goalId: null,
  durationWeeks: 8,
  daysPerWeek: 3,
  createdAt: "2025-01-01T00:00:00Z",
};

const DAYS = [
  { id: "day-1", dayName: "Push", dayOrder: 1, focusArea: "Push", scheduledDate: null },
  { id: "day-2", dayName: "Pull", dayOrder: 2, focusArea: "Pull", scheduledDate: null },
];

const DAY_DETAIL = {
  ...DAYS[0],
  exercises: [
    {
      id: "de-1",
      exerciseId: "ex-1",
      exerciseName: "Bench Press",
      exerciseOrder: 1,
      targetSets: 4,
      targetRepsMin: 8,
      targetRepsMax: 12,
      restSeconds: 90,
      notes: null,
    },
    {
      id: "de-2",
      exerciseId: "ex-2",
      exerciseName: "Overhead Press",
      exerciseOrder: 2,
      targetSets: 3,
      targetRepsMin: 8,
      targetRepsMax: 10,
      restSeconds: 60,
      notes: null,
    },
  ],
};

const SESSIONS: unknown[] = [];

describe("workout.service — getTodayWorkout", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    clearTokens();
    storeTokens("test-token", "test-refresh");
  });

  it("composes a Workout from plan + days + day detail when no session exists", async () => {
    // Calls: active plan, days, day detail, recent sessions
    mockFetch
      .mockResolvedValueOnce(jsonResponse(PLAN))       // GET /workout-plans/active
      .mockResolvedValueOnce(jsonResponse(DAYS))        // GET /workout-plans/plan-1/days
      .mockResolvedValueOnce(jsonResponse(DAY_DETAIL))  // GET /workout-plans/days/day-X
      .mockResolvedValueOnce(jsonResponse(SESSIONS));   // GET /workout-sessions

    const workout = await getTodayWorkout();

    expect(workout).not.toBeNull();
    expect(workout!.name).toBe("Push");
    expect(workout!.status).toBe("planned");
    expect(workout!.exercises).toHaveLength(2);
    expect(workout!.exercises[0].exerciseName).toBe("Bench Press");
    expect(workout!.exercises[1].exerciseName).toBe("Overhead Press");
  });

  it("returns null when user has no active plan (404)", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ message: "Not found" }, 404),
    );

    const workout = await getTodayWorkout();
    expect(workout).toBeNull();
  });

  it("includes logged sets when an in-progress session exists", async () => {
    const today = new Date().toISOString().split("T")[0];
    // Use scheduledDate matching for deterministic day selection
    const todayDays = [
      { id: "day-t", dayName: "Push", dayOrder: 1, focusArea: "Push", scheduledDate: today },
    ];
    const todayDayDetail = { ...DAY_DETAIL, id: "day-t", scheduledDate: today };

    const session = {
      id: "sess-1",
      dayId: "day-t",
      sessionStatus: "IN_PROGRESS",
      startedAt: "2025-06-01T10:00:00Z",
      completedAt: null,
      notes: null,
      rating: null,
      exerciseCount: 1,
      totalSets: 1,
      totalVolume: 600,
    };
    const sets = [
      {
        id: "set-1",
        exerciseId: "ex-1",
        setNumber: 1,
        weightKg: 60,
        repsCompleted: 10,
        rpe: 7,
        isWarmup: false,
        isFailure: false,
      },
    ];

    mockFetch
      .mockResolvedValueOnce(jsonResponse(PLAN))
      .mockResolvedValueOnce(jsonResponse(todayDays))
      .mockResolvedValueOnce(jsonResponse(todayDayDetail))
      .mockResolvedValueOnce(jsonResponse([session]))
      .mockResolvedValueOnce(jsonResponse(sets));

    const workout = await getTodayWorkout();

    expect(workout!.status).toBe("in_progress");
    expect(workout!.id).toBe("sess-1");
    expect(workout!.exercises[0].sets).toHaveLength(1);
    expect(workout!.exercises[0].sets[0].weightKg).toBe(60);
  });
});

describe("workout.service — generateWorkoutPlan", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    clearTokens();
    storeTokens("test-token", "test-refresh");
  });

  it("sends POST to /workout-plans/generate and returns the plan", async () => {
    const input = {
      goal: "GAIN_MUSCLE" as const,
      experienceLevel: "INTERMEDIATE" as const,
      daysPerWeek: 4,
      durationWeeks: 8,
      sessionDurationMinutes: 60,
      availableEquipment: ["BARBELL" as const, "DUMBBELL" as const],
      injuryRestrictions: [],
    };

    const responsePlan = {
      id: "plan-new",
      planName: "4-Day Gain Muscle Plan",
      description: "Generated plan",
      planStatus: "ACTIVE",
      goalId: null,
      durationWeeks: 8,
      daysPerWeek: 4,
      createdAt: "2025-06-01T00:00:00Z",
    };

    mockFetch.mockResolvedValueOnce(jsonResponse(responsePlan, 201));

    const result = await generateWorkoutPlan(input);

    expect(result.id).toBe("plan-new");
    expect(result.planName).toBe("4-Day Gain Muscle Plan");
    expect(result.planStatus).toBe("ACTIVE");
    expect(result.daysPerWeek).toBe(4);

    // Verify fetch was called with correct URL and method
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain("/workout-plans/generate");
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body)).toEqual(input);
  });

  it("throws on validation error from backend", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ message: "Validation failed", code: "VALIDATION_ERROR" }, 400),
    );

    const input = {
      goal: "GAIN_MUSCLE" as const,
      experienceLevel: "BEGINNER" as const,
      daysPerWeek: 3,
      durationWeeks: 8,
      sessionDurationMinutes: 60,
      availableEquipment: ["BODYWEIGHT" as const],
      injuryRestrictions: [],
    };

    await expect(generateWorkoutPlan(input)).rejects.toThrow();
  });
});
