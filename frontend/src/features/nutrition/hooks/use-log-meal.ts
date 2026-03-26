import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as nutritionService from "@/api/services/nutrition.service";
import type { Meal } from "@/api/schemas/nutrition.schema";

export function useLogMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Meal, "id">) => nutritionService.logMeal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nutrition.all });
    },
  });
}
