import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as workoutService from "@/api/services/workout.service";

export function useStartWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dayId: string) => workoutService.startWorkout(dayId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workouts.today() });
    },
  });
}
