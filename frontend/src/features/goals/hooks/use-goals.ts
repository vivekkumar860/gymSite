import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as goalsService from "@/api/services/goals.service";

export function useGoals() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.goals.active(),
    queryFn: goalsService.getActiveGoals,
  });

  return {
    goals: data,
    isLoading,
    error,
  };
}
