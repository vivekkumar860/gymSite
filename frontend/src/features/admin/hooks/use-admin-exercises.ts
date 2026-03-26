"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as adminService from "@/api/services/admin.service";

export type AdminExerciseFilters = {
  page?: number;
  limit?: number;
  search?: string;
  primaryMuscle?: string;
  equipment?: string;
  difficulty?: string;
  isActive?: boolean;
};

export function useAdminExercises(filters: AdminExerciseFilters = {}) {
  return useQuery({
    queryKey: queryKeys.admin.exercises(filters),
    queryFn: () => adminService.getExercises(filters),
  });
}

export function useAdminExerciseDetail(exerciseId: string) {
  return useQuery({
    queryKey: queryKeys.admin.exerciseDetail(exerciseId),
    queryFn: () => adminService.getExerciseById(exerciseId),
    enabled: !!exerciseId,
  });
}
