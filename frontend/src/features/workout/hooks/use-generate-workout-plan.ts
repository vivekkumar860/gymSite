import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/config/query-keys";
import { DASHBOARD_QUERY_KEYS } from "@/features/dashboard/constants/dashboard-constants";
import { ROUTES } from "@/config/routes";
import * as workoutService from "@/api/services/workout.service";
import type { GeneratePlanFormValues } from "../schemas/generate-plan-schema";

export function useGenerateWorkoutPlan() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: GeneratePlanFormValues) =>
      workoutService.generateWorkoutPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workouts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.workouts.today() });
      queryClient.invalidateQueries({
        queryKey: DASHBOARD_QUERY_KEYS.todaysWorkout(),
      });
      queryClient.invalidateQueries({
        queryKey: DASHBOARD_QUERY_KEYS.weeklySummary(),
      });
      router.push(ROUTES.workout.today);
    },
  });
}
