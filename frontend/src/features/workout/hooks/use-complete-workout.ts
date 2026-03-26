import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as workoutService from "@/api/services/workout.service";

export function useCompleteWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workoutService.completeWorkout(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workouts.today() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.workouts.all,
      });
    },
  });
}
