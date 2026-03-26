import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as exerciseService from "@/api/services/exercise.service";

type UseExercisesParams = {
  page: number;
  limit: number;
  search?: string;
  primaryMuscle?: string;
  equipment?: string;
};

export function useExercises(params: UseExercisesParams) {
  const { page, limit, search, primaryMuscle, equipment } = params;

  const query = useQuery({
    queryKey: [...queryKeys.exercises.all, { page, limit, search, primaryMuscle, equipment }],
    queryFn: () =>
      exerciseService.getExercises({
        page,
        limit,
        search,
        primaryMuscle,
        equipment,
      }),
  });

  return {
    exercises: query.data?.data ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    error: query.error,
  };
}
