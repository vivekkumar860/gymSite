"use client";

import { useExerciseDetail } from "../hooks/use-exercise-detail";
import { ExerciseDetailCard } from "../components/exercise-detail-card";
import { LoadingSkeleton } from "@/shared/components/loading-skeleton";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";

type ExerciseDetailViewProps = {
  exerciseId: string;
};

export function ExerciseDetailView({ exerciseId }: ExerciseDetailViewProps) {
  const { data: exercise, isLoading, error } = useExerciseDetail(exerciseId);

  if (isLoading) {
    return <LoadingSkeleton variant="detail" />;
  }

  if (error) {
    return (
      <ErrorBoundaryCard
        message={error.message ?? "Failed to load exercise details."}
      />
    );
  }

  if (!exercise) {
    return (
      <ErrorBoundaryCard message="Exercise not found." />
    );
  }

  return <ExerciseDetailCard exercise={exercise} />;
}
