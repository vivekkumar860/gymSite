"use client";

import { useRouter } from "next/navigation";
import { useWorkoutDetail } from "../hooks/use-workout-detail";
import { WorkoutSessionHeader } from "../components/workout-session-header";
import { WorkoutSummaryCard } from "../components/workout-summary-card";
import { WorkoutDetailExercises } from "../components/workout-detail-exercises";
import { LoadingSkeleton } from "@/shared/components/loading-skeleton";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";
import { PageHeader } from "@/shared/components/page-header";
import { formatErrorMessage } from "@/shared/utils/format-error";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { ROUTES } from "@/config/routes";

type WorkoutDetailViewProps = {
  workoutId: string;
};

export function WorkoutDetailView({ workoutId }: WorkoutDetailViewProps) {
  const router = useRouter();
  const { workout, isLoading, error, refetch } = useWorkoutDetail(workoutId);

  if (isLoading) {
    return (
      <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
        <PageHeader title="Workout Details" />
        <LoadingSkeleton variant="detail" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
        <PageHeader title="Workout Details" />
        <ErrorBoundaryCard
          message={formatErrorMessage(error, "Failed to load workout.")}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
        <PageHeader title="Workout Details" />
        <ErrorBoundaryCard message="Workout not found." />
      </div>
    );
  }

  const isCompleted = workout.status === "completed";

  return (
    <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
      <PageHeader title="Workout Details">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(ROUTES.workout.history)}
          className="hover:border-primary/40 hover:bg-primary/5"
        >
          <ArrowLeftIcon className="mr-1.5 size-4" />
          Back to History
        </Button>
      </PageHeader>

      {isCompleted && <WorkoutSummaryCard workout={workout} />}

      <WorkoutSessionHeader
        name={workout.name}
        exerciseCount={workout.exercises.length}
        status={workout.status}
        startedAt={workout.startedAt}
      />

      <WorkoutDetailExercises exercises={workout.exercises} />

      {workout.notes && (
        <div className="glass rounded-2xl border-glow p-4">
          <h3 className="mb-1 font-mono text-xs uppercase tracking-widest text-primary/60">Notes</h3>
          <p className="text-sm text-muted-foreground/80">{workout.notes}</p>
        </div>
      )}
    </div>
  );
}
