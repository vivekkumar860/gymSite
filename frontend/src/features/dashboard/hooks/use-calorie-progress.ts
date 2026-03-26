import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_QUERY_KEYS } from "../constants/dashboard-constants";
import * as dashboardService from "@/api/services/dashboard.service";
import { STALE_TIME_SHORT } from "@/config/constants";
import type { NutrientProgressData } from "../types/dashboard.types";

export function useCalorieProgress() {
  const today = new Date().toISOString().split("T")[0];

  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.calorieProgress(),
    queryFn: async (): Promise<NutrientProgressData> => {
      const nutrition = await dashboardService.getDailyNutrition(today);
      if (!nutrition) {
        return { current: 0, target: 2000, unit: "kcal" };
      }
      return {
        current: nutrition.totalMacros.calories,
        target: nutrition.targetMacros.calories,
        unit: "kcal",
      };
    },
    staleTime: STALE_TIME_SHORT,
  });
}
