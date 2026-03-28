import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/config/query-keys";
import { ROUTES } from "@/config/routes";
import * as nutritionService from "@/api/services/nutrition.service";
import type { GenerateNutritionPlanFormValues } from "../schemas/generate-nutrition-plan-schema";

export function useGenerateNutritionPlan() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: GenerateNutritionPlanFormValues) =>
      nutritionService.generateNutritionPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nutrition.all });
      router.push(ROUTES.nutrition.home);
    },
  });
}
