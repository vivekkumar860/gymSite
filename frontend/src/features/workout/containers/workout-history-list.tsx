"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkoutHistory } from "../hooks/use-workout-history";
import { WorkoutCard } from "../components/workout-card";
import { LoadingSkeleton } from "@/shared/components/loading-skeleton";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";
import { EmptyState } from "@/shared/components/empty-state";
import { PageHeader } from "@/shared/components/page-header";
import { formatErrorMessage } from "@/shared/utils/format-error";
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
      <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
        <PageHeader title="Workout History" description="Your past workouts and performance" />
        <LoadingSkeleton variant="card" count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
        <PageHeader title="Workout History" description="Your past workouts and performance" />
        <ErrorBoundaryCard
          message={formatErrorMessage(error, "Failed to load workout history.")}
        />
      </div>
    );
  }

  if (!workouts || workouts.length === 0) {
    return (
      <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
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
    <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
      <PageHeader title="Workout History" description="Your past workouts and performance" />

      {/* Timeline layout */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border/30 md:left-6" />
        <div className="space-y-4 pl-10 md:pl-14">
          {workouts.map((workout, idx) => (
            <div
              key={workout.id}
              className="relative animate-slide-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Timeline dot */}
              <div className="absolute -left-[26px] top-4 size-3 rounded-full bg-primary glow-sm md:-left-[38px]" />
              <WorkoutCard
                workout={workout}
                onClick={() => router.push(`${ROUTES.workout.history}/${workout.id}`)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="hover:border-primary/40 hover:bg-primary/5"
          >
            Previous
          </Button>
          <span className="text-sm font-mono text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="hover:border-primary/40 hover:bg-primary/5"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
