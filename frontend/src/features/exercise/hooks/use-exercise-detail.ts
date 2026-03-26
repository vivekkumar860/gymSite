import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as exerciseService from "@/api/services/exercise.service";

export function useExerciseDetail(exerciseId: string) {
  return useQuery({
    queryKey: queryKeys.exercises.detail(exerciseId),
    queryFn: () => exerciseService.getExerciseBySlug(exerciseId),
    enabled: !!exerciseId,
  });
}
