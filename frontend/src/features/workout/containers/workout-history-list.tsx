"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkoutHistory } from "../hooks/use-workout-history";
import { WorkoutCard } from "../components/workout-card";
import { LoadingSkeleton } from "@/shared/components/loading-skeleton";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";
import { EmptyState } from "@/shared/components/empty-state";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { DEFAULT_PAGE_SIZE } from "@/config/constants";

export function WorkoutHistoryList() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { workouts, meta, isLoading, error } = useWorkoutHistory({
    page,
    limit: DEFAULT_PAGE_SIZE,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Workout History" description="Your past workouts and performance" />
        <LoadingSkeleton variant="card" count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Workout History" description="Your past workouts and performance" />
        <ErrorBoundaryCard
          message={error.message ?? "Failed to load workout history."}
        />
      </div>
    );
  }

  if (!workouts || workouts.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Workout History" description="Your past workouts and performance" />
        <EmptyState
          title="No workout history"
          description="Complete your first workout to see it here."
        />
      </div>
    );
  }

  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <PageHeader title="Workout History" description="Your past workouts and performance" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onClick={() => router.push(`${ROUTES.workout.history}/${workout.id}`)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
