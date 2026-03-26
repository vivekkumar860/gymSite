import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as workoutService from "@/api/services/workout.service";

export function useDeleteSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (setId: string) => workoutService.deleteSet(setId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workouts.today() });
      queryClient.invalidateQueries({ queryKey: queryKeys.workouts.all });
    },
  });
}
