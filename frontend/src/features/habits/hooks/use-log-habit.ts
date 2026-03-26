import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as habitsService from "@/api/services/habits.service";
import type { HabitLog } from "@/api/schemas/habits.schema";

export function useLogHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      habitId,
      data,
    }: {
      habitId: string;
      data: Omit<HabitLog, "id" | "habitId">;
    }) => habitsService.logHabitCompletion(habitId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.habits.daily(new Date().toISOString().split("T")[0]),
      });
    },
  });
}
