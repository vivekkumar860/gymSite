import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as nutritionService from "@/api/services/nutrition.service";

export function useActivatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => nutritionService.activatePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nutrition.all });
    },
  });
}
