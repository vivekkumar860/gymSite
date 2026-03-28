import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as habitsService from "@/api/services/habits.service";

export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof habitsService.updateHabit>[1];
    }) => habitsService.updateHabit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits.all });
    },
  });
}
