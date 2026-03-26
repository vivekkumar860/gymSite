import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_QUERY_KEYS } from "../constants/dashboard-constants";
import * as dashboardService from "@/api/services/dashboard.service";
import { STALE_TIME_MEDIUM } from "@/config/constants";

export function useStreakCount() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.streakCount(),
    queryFn: dashboardService.getStreakCount,
    staleTime: STALE_TIME_MEDIUM,
  });
}
