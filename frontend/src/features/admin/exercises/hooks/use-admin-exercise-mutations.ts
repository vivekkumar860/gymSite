"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as adminService from "@/api/services/admin.service";
import type { ExerciseFormSchema } from "../schemas/exercise-form-schema";

function useInvalidateExercises() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
}

export function useCreateExercise() {
  const invalidate = useInvalidateExercises();

  return useMutation({
    mutationFn: (data: ExerciseFormSchema) =>
      adminService.createExercise(data),
    onSuccess: invalidate,
  });
}

export function useUpdateExercise() {
  const invalidate = useInvalidateExercises();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExerciseFormSchema> }) =>
      adminService.updateExercise(id, data),
    onSuccess: invalidate,
  });
}

export function useArchiveExercise() {
  const invalidate = useInvalidateExercises();

  return useMutation({
    mutationFn: (id: string) => adminService.archiveExercise(id),
    onSuccess: invalidate,
  });
}

export function useUnarchiveExercise() {
  const invalidate = useInvalidateExercises();

  return useMutation({
    mutationFn: (id: string) => adminService.unarchiveExercise(id),
    onSuccess: invalidate,
  });
}
