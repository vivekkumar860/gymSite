"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as adminService from "@/api/services/admin.service";

export function useAdminExercises(params: Record<string, unknown>) {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.admin.exercises(params),
    queryFn: () => adminService.getExercises(params as Parameters<typeof adminService.getExercises>[0]),
  });

  return {
    exercises: data?.data,
    meta: data?.meta,
    isLoading,
    error,
  };
}
