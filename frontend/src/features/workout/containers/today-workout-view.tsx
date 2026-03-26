"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTodayWorkout } from "../hooks/use-today-workout";
import { useStartWorkout } from "../hooks/use-start-workout";
import { useCompleteWorkout } from "../hooks/use-complete-workout";
import { useLogSet } from "../hooks/use-log-set";
import { WorkoutSessionHeader } from "../components/workout-session-header";
import { WorkoutExerciseCard } from "../components/workout-exercise-card";
import { WorkoutSummaryCard } from "../components/workout-summary-card";
import { SetLoggerForm } from "../components/set-logger-form";
import { RestTimerDialog } from "../components/rest-timer-dialog";
import { LoadingSkeleton } from "@/shared/components/loading-skeleton";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";
import { EmptyState } from "@/shared/components/empty-state";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { PageHeader } from "@/shared/components/page-header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROUTES } from "@/config/routes";
import { toLogSetDto, type LogSetFormValues } from "../types/workout.types";

export function TodayWorkoutView() {
  const router = useRouter();
  const { workout, isLoading, error, refetch } = useTodayWorkout();
  const startWorkout = useStartWorkout();
  const completeWorkout = useCompleteWorkout();
  const logSet = useLogSet();

  const [logExerciseId, setLogExerciseId] = useState<string | null>(null);
  const [restTimerOpen, setRestTimerOpen] = useState(false);
  const [confirmCompleteOpen, setConfirmCompleteOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Today's Workout" />
        <LoadingSkeleton variant="detail" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Today's Workout" />
        <ErrorBoundaryCard
          message={error.message ?? "Failed to load today's workout."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="space-y-6">
        <PageHeader title="Today's Workout" />
        <EmptyState
          title="No workout planned for today"
          description="Take a rest day or create a new workout plan."
          action={{
            label: "View Workout Plans",
            onClick: () => router.push(ROUTES.workout.plan),
          }}
        />
      </div>
    );
  }

  const isActive = workout.status === "in_progress";
  const isCompleted = workout.status === "completed";

  function handleLogSet(values: LogSetFormValues) {
    if (!logExerciseId || !workout) return;

    const exercise = workout.exercises.find((e) => e.id === logExerciseId);
    const nextSetNumber = exercise ? exercise.sets.length + 1 : 1;
    const dto = toLogSetDto(
      values,
      exercise?.exerciseId ?? logExerciseId,
      nextSetNumber,
    );

    logSet.mutate(
      { sessionId: workout.id, data: dto },
      {
        onSuccess: () => {
          setLogExerciseId(null);
          setRestTimerOpen(true);
        },
      },
    );
  }

  function handleConfirmComplete() {
    completeWorkout.mutate(workout!.id);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Today's Workout" />

      {/* Completion summary */}
      {isCompleted && <WorkoutSummaryCard workout={workout} />}

      {/* Session header with status, timer, actions */}
      <WorkoutSessionHeader
        name={workout.name}
        exerciseCount={workout.exercises.length}
        status={workout.status}
        startedAt={workout.startedAt}
        onStart={() => startWorkout.mutate(workout.id)}
        onComplete={() => setConfirmCompleteOpen(true)}
        isStarting={startWorkout.isPending}
        isCompleting={completeWorkout.isPending}
      />

      {/* Exercise list */}
      <div className="space-y-4">
        {workout.exercises.map((exercise) => (
          <WorkoutExerciseCard
            key={exercise.id}
            exercise={exercise}
            onLogSet={isActive ? setLogExerciseId : undefined}
          />
        ))}
      </div>

      {/* Confirm completion dialog */}
      <ConfirmDialog
        open={confirmCompleteOpen}
        onOpenChange={setConfirmCompleteOpen}
        title="Complete Workout?"
        description="This will mark your workout as finished. You won't be able to log more sets after completing."
        confirmLabel="Complete Workout"
        onConfirm={handleConfirmComplete}
      />

      {/* Log set dialog */}
      <Dialog
        open={!!logExerciseId}
        onOpenChange={(open) => {
          if (!open) setLogExerciseId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Set</DialogTitle>
          </DialogHeader>
          <SetLoggerForm
            onSubmit={handleLogSet}
            isSubmitting={logSet.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Rest timer */}
      <RestTimerDialog open={restTimerOpen} onOpenChange={setRestTimerOpen} />
    </div>
  );
}
