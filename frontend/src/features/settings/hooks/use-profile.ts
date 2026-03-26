import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as userService from "@/api/services/user.service";

export function useProfile() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: userService.getProfile,
  });

  return {
    profile: data,
    isLoading,
    error,
  };
}
