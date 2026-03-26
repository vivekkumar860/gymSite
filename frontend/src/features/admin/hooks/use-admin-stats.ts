"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as adminService from "@/api/services/admin.service";

export function useAdminStats() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.admin.dashboard(),
    queryFn: () => adminService.getDashboard(),
  });

  return {
    stats: data,
    isLoading,
    error,
  };
}
