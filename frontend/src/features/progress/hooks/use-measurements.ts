import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as progressService from "@/api/services/progress.service";

export function useMeasurements() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.progress.measurements({}),
    queryFn: () => progressService.getMeasurements(),
  });

  return {
    measurements: data,
    isLoading,
    error,
  };
}
