import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as goalsService from "@/api/services/goals.service";

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => goalsService.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}
