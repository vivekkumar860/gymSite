"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useHabits } from "../hooks/use-habits";
import { useLogHabit } from "../hooks/use-log-habit";
import { useCreateHabit } from "../hooks/use-create-habit";
import { HabitsGrid } from "../components/habits-grid";
import { CreateHabitForm } from "../components/create-habit-form";
import type { CreateHabitFormValues } from "../types/habits.types";
import type { HabitWithStreak } from "@/api/schemas/habits.schema";
import { LoadingSkeleton } from "@/shared/components/loading-skeleton";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";
import { EmptyState } from "@/shared/components/empty-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function HabitsTrackerView() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: habitsRaw, isLoading, isError, error, refetch } = useHabits();
  const logHabit = useLogHabit();
  const createHabit = useCreateHabit();

  const habits: HabitWithStreak[] | undefined = useMemo(
    () =>
      habitsRaw?.map((h) => ({
        id: h.id,
        name: h.habitName,
        frequency: (h.frequency === "WEEKLY" ? "weekly" : "daily") as "daily" | "weekly",
        targetCount: h.targetValue ?? 1,
        color: h.colorHex ?? undefined,
        completionRate: 0,
        createdAt: "",
        currentStreak: h.currentStreak,
        longestStreak: h.longestStreak,
      })),
    [habitsRaw],
  );

  function handleToggleHabit(habitId: string) {
    const today = new Date().toISOString().split("T")[0];
    logHabit.mutate({
      habitId,
      data: {
        date: today,
        completed: true,
        count: 1,
      },
    });
  }

  function handleCreateHabit(values: CreateHabitFormValues) {
    createHabit.mutate(
      {
        habitName: values.name,
        frequency: values.frequency,
        targetValue: values.targetCount,
        colorHex: values.color,
      },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
          toast.success("Habit created");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to create habit");
        },
      },
    );
  }

  if (isLoading) {
    return <LoadingSkeleton variant="card" count={6} />;
  }

  if (isError) {
    return (
      <ErrorBoundaryCard
        message={error?.message ?? "Failed to load habits."}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">My Habits</h2>
        <Button onClick={() => setIsCreateOpen(true)}>New Habit</Button>
      </div>

      {habits && habits.length > 0 ? (
        <HabitsGrid
          habits={habits}
          todayLogs={[]}
          onToggleHabit={handleToggleHabit}
        />
      ) : (
        <EmptyState
          title="No habits yet"
          description="Start building better habits by creating your first one."
          action={{
            label: "Create Habit",
            onClick: () => setIsCreateOpen(true),
          }}
        />
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Habit</DialogTitle>
            <DialogDescription>
              Define a habit you want to track consistently.
            </DialogDescription>
          </DialogHeader>
          <CreateHabitForm
            onSubmit={handleCreateHabit}
            isSubmitting={createHabit.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
