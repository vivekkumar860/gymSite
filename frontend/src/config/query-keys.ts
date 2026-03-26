// ---------------------------------------------------------------------------
// TanStack Query key factory
//
// Every query key is a readonly tuple so that TypeScript can narrow types and
// TanStack Query can do exact / fuzzy matching on prefixes.
// ---------------------------------------------------------------------------

export const queryKeys = {
  // ---- Workouts ----
  workouts: {
    all: ["workouts"] as const,
    today: () => ["workouts", "today"] as const,
    history: (params: Record<string, unknown>) =>
      ["workouts", "history", params] as const,
    detail: (id: string) => ["workouts", "detail", id] as const,
  },

  // ---- Exercises ----
  exercises: {
    all: ["exercises"] as const,
    search: (query: string) => ["exercises", "search", query] as const,
    detail: (id: string) => ["exercises", "detail", id] as const,
    byMuscleGroup: (muscleGroup: string) =>
      ["exercises", "muscleGroup", muscleGroup] as const,
  },

  // ---- Nutrition ----
  nutrition: {
    all: ["nutrition"] as const,
    daily: (date: string) => ["nutrition", "daily", date] as const,
    meals: (params: Record<string, unknown>) =>
      ["nutrition", "meals", params] as const,
  },

  // ---- Habits ----
  habits: {
    all: ["habits"] as const,
    daily: (date: string) => ["habits", "daily", date] as const,
    streaks: () => ["habits", "streaks"] as const,
  },

  // ---- Progress ----
  progress: {
    all: ["progress"] as const,
    measurements: (params: Record<string, unknown>) =>
      ["progress", "measurements", params] as const,
    photos: () => ["progress", "photos"] as const,
  },

  // ---- Goals ----
  goals: {
    all: ["goals"] as const,
    active: () => ["goals", "active"] as const,
    detail: (id: string) => ["goals", "detail", id] as const,
  },

  // ---- User ----
  user: {
    profile: () => ["user", "profile"] as const,
    preferences: () => ["user", "preferences"] as const,
  },

  // ---- Admin ----
  admin: {
    all: ["admin"] as const,
    dashboard: () => ["admin", "dashboard"] as const,
    users: (params: Record<string, unknown>) =>
      ["admin", "users", params] as const,
    userDetail: (id: string) => ["admin", "users", "detail", id] as const,
    exercises: (params: Record<string, unknown>) =>
      ["admin", "exercises", params] as const,
    exerciseDetail: (id: string) =>
      ["admin", "exercises", "detail", id] as const,
    auditLogs: (params: Record<string, unknown>) =>
      ["admin", "audit-logs", params] as const,
  },
} as const;
