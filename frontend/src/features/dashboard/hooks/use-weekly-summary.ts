import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_QUERY_KEYS } from "../constants/dashboard-constants";
import * as dashboardService from "@/api/services/dashboard.service";
import { STALE_TIME_SHORT } from "@/config/constants";

export function useWeeklySummary() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.weeklySummary(),
    queryFn: dashboardService.getWeeklySummary,
    staleTime: STALE_TIME_SHORT,
  });
}
