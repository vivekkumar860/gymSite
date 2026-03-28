import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as habitsService from "@/api/services/habits.service";

export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => habitsService.deleteHabit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits.all });
    },
  });
}
