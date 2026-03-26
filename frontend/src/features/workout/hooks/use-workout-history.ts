import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as workoutService from "@/api/services/workout.service";

export function useWorkoutHistory(params: { page: number; limit: number }) {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.workouts.history(params),
    queryFn: () => workoutService.getWorkoutHistory(params),
  });

  return {
    workouts: data?.data,
    meta: data?.meta,
    isLoading,
    error,
  };
}
