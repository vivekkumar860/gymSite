import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DASHBOARD_QUERY_KEYS } from "../constants/dashboard-constants";
import * as dashboardService from "@/api/services/dashboard.service";
import { STALE_TIME_SHORT } from "@/config/constants";

export function useWaterTarget() {
  const today = new Date().toISOString().split("T")[0];

  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.waterTarget(),
    queryFn: () => dashboardService.getWaterTarget(today),
    staleTime: STALE_TIME_SHORT,
  });
}

export function useLogWater() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amountMl: number) => dashboardService.logWater(amountMl),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DASHBOARD_QUERY_KEYS.waterTarget(),
      });
    },
  });
}
