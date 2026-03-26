import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as nutritionService from "@/api/services/nutrition.service";

export function useDailyNutrition(date: string) {
  return useQuery({
    queryKey: queryKeys.nutrition.daily(date),
    queryFn: () => nutritionService.getDailyNutrition(date),
  });
}
