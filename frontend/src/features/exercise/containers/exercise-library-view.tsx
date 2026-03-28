"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useExercises } from "../hooks/use-exercises";
import { ExerciseFilters } from "../components/exercise-filters";
import { ExerciseGrid } from "../components/exercise-grid";
import { LoadingSkeleton } from "@/shared/components/loading-skeleton";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";
import { EmptyState } from "@/shared/components/empty-state";
import { formatErrorMessage } from "@/shared/utils/format-error";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { DEFAULT_PAGE_SIZE } from "@/config/constants";
import type { ExerciseFilters as ExerciseFiltersType } from "../types/exercise.types";

export function ExerciseLibraryView() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = DEFAULT_PAGE_SIZE;
  const [filters, setFilters] = useState<ExerciseFiltersType>({});

  const { exercises, meta, isLoading, error } = useExercises({
    page,
    limit,
    search: filters.search,
    primaryMuscle: filters.primaryMuscle,
    equipment: filters.equipment,
  });

  const handleFiltersChange = useCallback((newFilters: ExerciseFiltersType) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleExerciseClick = (id: string) => {
    router.push(ROUTES.exercises.detail(id));
  };

  if (error) {
    return (
      <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
        <ErrorBoundaryCard
          message={formatErrorMessage(error, "Failed to load exercises.")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-black tracking-tighter">Exercise Library</h1>
      <ExerciseFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {isLoading ? (
        <LoadingSkeleton variant="card" count={6} />
      ) : exercises.length === 0 ? (
        <EmptyState
          title="No exercises found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <>
          <ExerciseGrid
            exercises={exercises}
            onExerciseClick={handleExerciseClick}
          />

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="hover:border-primary/40 hover:bg-primary/5"
              >
                Previous
              </Button>
              <span className="text-sm font-mono text-muted-foreground">
                Page {meta.page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.totalPages}
                onClick={() => setPage(page + 1)}
                className="hover:border-primary/40 hover:bg-primary/5"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
