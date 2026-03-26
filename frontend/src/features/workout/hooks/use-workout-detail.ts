import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as workoutService from "@/api/services/workout.service";

export function useWorkoutDetail(id: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.workouts.detail(id),
    queryFn: () => workoutService.getWorkoutById(id),
    enabled: !!id,
  });

  return {
    workout: data,
    isLoading,
    error,
    refetch,
  };
}
