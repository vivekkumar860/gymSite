import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_QUERY_KEYS } from "../constants/dashboard-constants";
import * as dashboardService from "@/api/services/dashboard.service";
import { STALE_TIME_MEDIUM } from "@/config/constants";

export function useSleepSummary() {
  const today = new Date().toISOString().split("T")[0];

  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.sleepSummary(),
    queryFn: () => dashboardService.getSleepSummary(today),
    staleTime: STALE_TIME_MEDIUM,
  });
}
