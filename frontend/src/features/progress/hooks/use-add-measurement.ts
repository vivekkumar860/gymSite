import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as progressService from "@/api/services/progress.service";

export function useAddMeasurement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      site: string;
      valueCm: number;
      measuredAt: string;
      notes?: string;
    }) => progressService.addMeasurement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.progress.measurements({}),
      });
    },
  });
}
