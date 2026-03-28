import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as nutritionService from "@/api/services/nutrition.service";

export function useNutritionPlanHistory() {
  return useQuery({
    queryKey: [...queryKeys.nutrition.all, "history"],
    queryFn: nutritionService.getNutritionPlanHistory,
  });
}
