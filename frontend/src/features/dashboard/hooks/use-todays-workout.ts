import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_QUERY_KEYS } from "../constants/dashboard-constants";
import * as dashboardService from "@/api/services/dashboard.service";
import { STALE_TIME_SHORT } from "@/config/constants";

export function useTodaysWorkout() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.todaysWorkout(),
    queryFn: dashboardService.getTodaysWorkout,
    staleTime: STALE_TIME_SHORT,
  });
}
