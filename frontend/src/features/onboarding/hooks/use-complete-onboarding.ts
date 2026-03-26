import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/config/query-keys";
import { ROUTES } from "@/config/routes";
import * as userService from "@/api/services/user.service";
import type { OnboardingData } from "@/api/schemas/user.schema";

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: OnboardingData) =>
      userService.completeOnboarding(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      router.push(ROUTES.dashboard);
    },
  });
}
