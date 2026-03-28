import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_QUERY_KEYS } from "../constants/dashboard-constants";
import * as dashboardService from "@/api/services/dashboard.service";
import { STALE_TIME_SHORT } from "@/config/constants";
import type { NutrientProgressData } from "../types/dashboard.types";

export function useProteinProgress() {
  const today = new Date().toISOString().split("T")[0];

  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.proteinProgress(),
    queryFn: async (): Promise<NutrientProgressData> => {
      const nutrition = await dashboardService.getDailyNutrition(today);
      if (!nutrition) {
        return { current: 0, target: null, unit: "g" };
      }
      return {
        current: nutrition.totalMacros.protein,
        target: nutrition.targetMacros.protein,
        unit: "g",
      };
    },
    staleTime: STALE_TIME_SHORT,
  });
}
