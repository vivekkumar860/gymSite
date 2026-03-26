export const ROUTES = {
  auth: {
    login: "/login",
    register: "/register",
  },
  dashboard: "/dashboard",
  onboarding: "/onboarding",
  workout: {
    today: "/workout/today",
    plan: "/workout/plan",
    history: "/workout/history",
  },
  exercises: {
    list: "/exercises",
    detail: (id: string) => `/exercises/${id}` as const,
  },
  nutrition: "/nutrition",
  habits: "/habits",
  progress: "/progress",
  goals: "/goals",
  settings: "/settings",
  admin: {
    dashboard: "/admin/dashboard",
    users: "/admin/users",
    userDetail: (id: string) => `/admin/users/${id}` as const,
    exercises: "/admin/exercises",
    exerciseNew: "/admin/exercises/new",
    exerciseEdit: (id: string) => `/admin/exercises/${id}/edit` as const,
    auditLogs: "/admin/audit-logs",
  },
} as const;

export type AppRoutes = typeof ROUTES;
