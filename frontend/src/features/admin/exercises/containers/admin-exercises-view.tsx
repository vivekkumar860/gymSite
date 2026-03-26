"use client";

import { useState } from "react";
import { useAdminExercises } from "../hooks/use-admin-exercises";
import {
  useCreateExercise,
  useUpdateExercise,
  useArchiveExercise,
  useUnarchiveExercise,
} from "../hooks/use-admin-exercise-mutations";
import { ExerciseTable } from "../components/exercise-table";
import { ExerciseFilters } from "../components/exercise-filters";
import { ExerciseFormDialog } from "../components/exercise-form-dialog";
import { PageHeader } from "@/shared/components/page-header";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/shared/hooks";
import { DEFAULT_PAGE_SIZE } from "@/config/constants";
import type { AdminExercise } from "@/api/services/admin.service";
import type { AdminExerciseFilterState } from "../../types/admin.types";
import type { ExerciseFormSchema } from "../schemas/exercise-form-schema";

export function AdminExercisesView() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AdminExerciseFilterState>({
    search: "",
    primaryMuscle: "all",
    equipment: "all",
    difficulty: "all",
    isActive: "all",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<AdminExercise | null>(
    null,
  );

  const debouncedSearch = useDebounce(filters.search, 300);

  const queryParams = {
    page,
    limit: DEFAULT_PAGE_SIZE,
    search: debouncedSearch || undefined,
    primaryMuscle:
      filters.primaryMuscle === "all" ? undefined : filters.primaryMuscle,
    equipment: filters.equipment === "all" ? undefined : filters.equipment,
    difficulty: filters.difficulty === "all" ? undefined : filters.difficulty,
    isActive:
      filters.isActive === "all" ? undefined : filters.isActive === "true",
  };

  const { exercises, meta, isLoading, error } = useAdminExercises(queryParams);

  const createExercise = useCreateExercise();
  const updateExercise = useUpdateExercise();
  const archiveExercise = useArchiveExercise();
  const unarchiveExercise = useUnarchiveExercise();

  const handleOpenCreate = () => {
    setEditingExercise(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (exercise: AdminExercise) => {
    setEditingExercise(exercise);
    setDialogOpen(true);
  };

  const handleSubmit = (data: ExerciseFormSchema) => {
    if (editingExercise) {
      updateExercise.mutate(
        { id: editingExercise.id, data },
        { onSuccess: () => setDialogOpen(false) },
      );
    } else {
      createExercise.mutate(data, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  };

  const handleFiltersChange = (newFilters: AdminExerciseFilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  if (error) {
    return <ErrorBoundaryCard message="Failed to load exercises." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exercise Management"
        description="Create, edit, and manage the exercise catalog."
      >
        <Button onClick={handleOpenCreate}>Create Exercise</Button>
      </PageHeader>

      <ExerciseFilters filters={filters} onFiltersChange={handleFiltersChange} />

      <ExerciseTable
        exercises={exercises ?? []}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onArchive={(id) => archiveExercise.mutate(id)}
        onUnarchive={(id) => unarchiveExercise.mutate(id)}
      />

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= meta.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <ExerciseFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        exercise={editingExercise}
        onSubmit={handleSubmit}
        isPending={createExercise.isPending || updateExercise.isPending}
      />
    </div>
  );
}
