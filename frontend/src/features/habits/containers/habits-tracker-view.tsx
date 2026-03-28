"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useHabits } from "../hooks/use-habits";
import { useLogHabit } from "../hooks/use-log-habit";
import { useCreateHabit } from "../hooks/use-create-habit";
import { useUpdateHabit } from "../hooks/use-update-habit";
import { useDeleteHabit } from "../hooks/use-delete-habit";
import { HabitsGrid } from "../components/habits-grid";
import { CreateHabitForm } from "../components/create-habit-form";
import type { CreateHabitFormValues } from "../types/habits.types";
import type { HabitWithStreak } from "@/api/schemas/habits.schema";
import { LoadingSkeleton } from "@/shared/components/loading-skeleton";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";
import { formatErrorMessage } from "@/shared/utils/format-error";
import { EmptyState } from "@/shared/components/empty-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { queryKeys } from "@/config/query-keys";
import * as habitsService from "@/api/services/habits.service";

export function HabitsTrackerView() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const { data: habitsRaw, isLoading, isError, error, refetch } = useHabits();
  const logHabit = useLogHabit();
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();
  const deleteHabitMutation = useDeleteHabit();

  const habitIds = useMemo(
    () => habitsRaw?.map((h) => h.id) ?? [],
    [habitsRaw],
  );

  const { data: todayEntries } = useQuery({
    queryKey: [...queryKeys.habits.all, "today-entries"],
    queryFn: () => habitsService.getTodayEntries(habitIds),
    enabled: habitIds.length > 0,
  });

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

  const todayLogs = useMemo(
    () =>
      (todayEntries ?? []).map((e) => ({
        id: e.id,
        habitId: e.habitId,
        date: e.entryDate,
        completed: e.isCompleted,
        count: e.recordedValue ?? 0,
      })),
    [todayEntries],
  );

  function handleToggleHabit(habitId: string) {
    const today = new Date().toISOString().split("T")[0];
    logHabit.mutate(
      {
        habitId,
        data: { date: today, completed: true, count: 1 },
      },
      {
        onSuccess: () => toast.success("Habit logged!"),
        onError: (err) => toast.error(formatErrorMessage(err, "Failed to log habit")),
      },
    );
  }

  function handleEditHabit(values: CreateHabitFormValues) {
    if (!editingHabitId) return;
    updateHabit.mutate(
      {
        id: editingHabitId,
        data: {
          habitName: values.name,
          frequency: values.frequency,
          targetValue: values.targetCount,
          colorHex: values.color,
        },
      },
      {
        onSuccess: () => {
          setEditingHabitId(null);
          toast.success("Habit updated");
        },
        onError: (err) => toast.error(formatErrorMessage(err, "Failed to update habit")),
      },
    );
  }

  function handleDeleteHabit(habitId: string) {
    deleteHabitMutation.mutate(habitId, {
      onSuccess: () => toast.success("Habit deleted"),
      onError: (err) => toast.error(formatErrorMessage(err, "Failed to delete habit")),
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
    return (
      <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tighter">Habits</h2>
        </div>
        <LoadingSkeleton variant="card" count={6} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
        <ErrorBoundaryCard
          message={formatErrorMessage(error, "Failed to load habits.")}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const completedCount = todayLogs.filter((l) => l.completed).length;
  const totalCount = habits?.length ?? 0;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
      {/* Header with progress ring */}
      <div className="glass card-depth-2 rounded-2xl p-5 animate-slide-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mini progress ring */}
            <svg width="48" height="48" viewBox="0 0 48 48" className="shrink-0">
              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted/30" />
              <circle
                cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4"
                strokeLinecap="round"
                className="text-primary transition-all duration-500"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - progressPct / 100)}`}
                transform="rotate(-90 24 24)"
              />
              <text x="24" y="24" textAnchor="middle" dominantBaseline="central" className="fill-foreground font-bold" style={{ fontSize: 12 }}>
                {progressPct}%
              </text>
            </svg>
            <div>
              <h2 className="text-2xl font-black tracking-tighter">Today&apos;s Habits</h2>
              {totalCount > 0 && (
                <p className="text-sm text-muted-foreground/80">
                  {completedCount}/{totalCount} completed today
                </p>
              )}
            </div>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="glow-primary">New Habit</Button>
        </div>
      </div>

      {habits && habits.length > 0 ? (
        <HabitsGrid
          habits={habits}
          todayLogs={todayLogs}
          onToggleHabit={handleToggleHabit}
          onEditHabit={(habitId) => setEditingHabitId(habitId)}
          onDeleteHabit={handleDeleteHabit}
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

      {/* Create dialog */}
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

      {/* Edit dialog */}
      <Dialog open={!!editingHabitId} onOpenChange={(open) => { if (!open) setEditingHabitId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription>
              Update this habit&apos;s details.
            </DialogDescription>
          </DialogHeader>
          {editingHabitId && (() => {
            const h = habits?.find((hab) => hab.id === editingHabitId);
            if (!h) return null;
            return (
              <CreateHabitForm
                onSubmit={handleEditHabit}
                isSubmitting={updateHabit.isPending}
                defaultValues={{
                  name: h.name,
                  frequency: h.frequency === "weekly" ? "WEEKLY" : "DAILY",
                  targetCount: h.targetCount,
                  color: h.color,
                }}
              />
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
