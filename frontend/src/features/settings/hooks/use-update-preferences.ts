import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as userService from "@/api/services/user.service";
import type { UserPreferences } from "@/api/services/user.service";

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UserPreferences>) =>
      userService.updatePreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.preferences(),
      });
    },
  });
}
