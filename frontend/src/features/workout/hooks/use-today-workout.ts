import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as workoutService from "@/api/services/workout.service";

export function useTodayWorkout() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.workouts.today(),
    queryFn: workoutService.getTodayWorkout,
  });

  return {
    workout: data,
    isLoading,
    error,
    refetch,
  };
}
