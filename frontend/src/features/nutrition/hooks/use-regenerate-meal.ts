import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/config/query-keys";
import { formatErrorMessage } from "@/shared/utils/format-error";
import * as nutritionService from "@/api/services/nutrition.service";

export function useRegenerateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, mealId }: { planId: string; mealId: string }) =>
      nutritionService.regenerateSingleMeal(planId, mealId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.nutrition.all, "active-plan"],
      });
      toast.success("Meal regenerated");
    },
    onError: (err) => {
      toast.error(formatErrorMessage(err, "Failed to regenerate meal"));
    },
  });
}
