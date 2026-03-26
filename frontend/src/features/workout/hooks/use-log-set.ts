import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as workoutService from "@/api/services/workout.service";

export function useLogSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      data,
    }: {
      sessionId: string;
      data: Parameters<typeof workoutService.logSet>[1];
    }) => workoutService.logSet(sessionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workouts.today() });
      queryClient.invalidateQueries({ queryKey: queryKeys.workouts.all });
    },
  });
}
