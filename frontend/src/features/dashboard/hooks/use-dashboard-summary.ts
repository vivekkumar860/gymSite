import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { z } from "zod";

const recentWorkoutSchema = z.object({
  id: z.string(),
  name: z.string(),
  completedAt: z.string(),
  totalSets: z.number(),
  totalVolume: z.number(),
});

const dashboardSummarySchema = z.object({
  weeklyWorkoutCount: z.number(),
  activePlanName: z.string().nullable(),
  todayCalorieTarget: z.number().nullable(),
  activeGoalsCount: z.number(),
  habitsCompletedToday: z.number(),
  totalHabits: z.number(),
  longestCurrentStreak: z.number(),
  recentWorkouts: z.array(recentWorkoutSchema),
});

export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;

async function fetchDashboardSummary(): Promise<DashboardSummary> {
  return apiClient.get("/workouts/dashboard-summary", dashboardSummarySchema);
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: fetchDashboardSummary,
    staleTime: 30_000,
  });
}
