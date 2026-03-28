"use client";

import { useExerciseDetail } from "../hooks/use-exercise-detail";
import { ExerciseDetailCard } from "../components/exercise-detail-card";
import { LoadingSkeleton } from "@/shared/components/loading-skeleton";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";
import { formatErrorMessage } from "@/shared/utils/format-error";

type ExerciseDetailViewProps = {
  exerciseId: string;
};

export function ExerciseDetailView({ exerciseId }: ExerciseDetailViewProps) {
  const { data: exercise, isLoading, error } = useExerciseDetail(exerciseId);

  if (isLoading) {
    return (
      <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
        <LoadingSkeleton variant="detail" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
        <ErrorBoundaryCard
          message={formatErrorMessage(error, "Failed to load exercise details.")}
        />
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
        <ErrorBoundaryCard message="Exercise not found." />
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
      <ExerciseDetailCard exercise={exercise} />
    </div>
  );
}
