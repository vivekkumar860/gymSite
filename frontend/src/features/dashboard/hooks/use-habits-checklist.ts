import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DASHBOARD_QUERY_KEYS } from "../constants/dashboard-constants";
import * as dashboardService from "@/api/services/dashboard.service";
import * as habitsService from "@/api/services/habits.service";
import { queryKeys } from "@/config/query-keys";
import { STALE_TIME_SHORT } from "@/config/constants";
import type { HabitChecklistItem } from "../types/dashboard.types";

export function useHabitsChecklist() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.habitsChecklist(),
    queryFn: async (): Promise<HabitChecklistItem[]> => {
      const habits = await dashboardService.getHabitsChecklist();
      return habits.map((habit) => ({
        ...habit,
        completedToday: habit.completionRate > 0 && habit.currentStreak > 0,
      }));
    },
    staleTime: STALE_TIME_SHORT,
  });
}

export function useToggleHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      habitId,
      completed,
    }: {
      habitId: string;
      completed: boolean;
    }) =>
      habitsService.logHabitCompletion(habitId, {
        date: new Date().toISOString().split("T")[0],
        completed,
        count: completed ? 1 : 0,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DASHBOARD_QUERY_KEYS.habitsChecklist(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.habits.all });
    },
  });
}
