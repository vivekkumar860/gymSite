import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as progressService from "@/api/services/progress.service";

export function useExerciseProgress(exerciseId: string) {
  return useQuery({
    queryKey: queryKeys.progress.all,
    queryFn: () => progressService.getEntries(exerciseId),
    enabled: !!exerciseId,
  });
}
