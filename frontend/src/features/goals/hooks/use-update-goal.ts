import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as goalsService from "@/api/services/goals.service";

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{
        currentValue: number;
        goalStatus: string;
        title: string;
        description: string;
      }>;
    }) => goalsService.updateGoal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}
