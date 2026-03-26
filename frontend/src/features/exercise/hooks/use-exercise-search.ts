import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { useDebounce } from "@/shared/hooks/use-debounce";
import * as exerciseService from "@/api/services/exercise.service";
import { DEBOUNCE_DELAY_MS } from "@/config/constants";

export function useExerciseSearch(query: string) {
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY_MS);

  return useQuery({
    queryKey: queryKeys.exercises.search(debouncedQuery),
    queryFn: () => exerciseService.searchExercises(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });
}
