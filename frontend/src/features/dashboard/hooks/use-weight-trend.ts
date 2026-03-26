import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_QUERY_KEYS, WEIGHT_TREND_DAYS } from "../constants/dashboard-constants";
import * as dashboardService from "@/api/services/dashboard.service";
import { STALE_TIME_MEDIUM } from "@/config/constants";

export function useWeightTrend() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.weightTrend(),
    queryFn: () => dashboardService.getWeightTrend(WEIGHT_TREND_DAYS),
    staleTime: STALE_TIME_MEDIUM,
  });
}
