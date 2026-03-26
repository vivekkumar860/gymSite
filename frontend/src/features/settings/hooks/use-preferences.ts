import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as userService from "@/api/services/user.service";

export function usePreferences() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.user.preferences(),
    queryFn: userService.getPreferences,
  });

  return {
    preferences: data,
    isLoading,
    error,
  };
}
