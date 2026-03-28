"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useGoals } from "../hooks/use-goals";
import { useCreateGoal } from "../hooks/use-create-goal";
import { useUpdateGoal } from "../hooks/use-update-goal";
import { useDeleteGoal } from "../hooks/use-delete-goal";
import { GoalCard } from "../components/goal-card";
import { CreateGoalForm } from "../components/create-goal-form";
import { PageHeader } from "@/shared/components/page-header";
import { LoadingSkeleton } from "@/shared/components/loading-skeleton";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";
import { EmptyState } from "@/shared/components/empty-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TargetIcon, TrophyIcon } from "lucide-react";
import type { CreateGoalSchema } from "../schemas/create-goal-schema";

export function GoalsOverviewView() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { goals, isLoading, error } = useGoals();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoalMutation = useDeleteGoal();

  function handleCreateGoal(data: CreateGoalSchema) {
    createGoal.mutate(
      {
        goalType: data.type,
        title: data.title,
        description: data.description,
        targetValue: data.targetValue,
        targetUnit: data.unit,
        deadline: data.targetDate,
      },
      {
        onSuccess: () => {
          setDialogOpen(false);
          toast.success("Goal created");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to create goal");
        },
      },
    );
  }

  function handleUpdateProgress(goalId: string, currentValue: number) {
    updateGoal.mutate(
      { id: goalId, data: { currentValue } },
      {
        onSuccess: () => toast.success("Progress updated"),
        onError: (err) => toast.error(err.message || "Failed to update progress"),
      },
    );
  }

  function handleComplete(goalId: string) {
    updateGoal.mutate(
      { id: goalId, data: { goalStatus: "COMPLETED" } },
      {
        onSuccess: () => toast.success("Goal completed!"),
        onError: (err) => toast.error(err.message || "Failed to complete goal"),
      },
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
        <PageHeader title="Goals" />
        <LoadingSkeleton variant="card" count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
        <PageHeader title="Goals" />
        <ErrorBoundaryCard message="Failed to load goals." />
      </div>
    );
  }

  const goalsList = goals ?? [];
  const activeCount = goalsList.filter((g) => g.goalStatus === "ACTIVE").length;
  const completedCount = goalsList.filter((g) => g.goalStatus === "COMPLETED").length;

  return (
    <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
      {/* Header card with trophy */}
      <div className="glass card-depth-2 rounded-2xl p-5 animate-slide-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/10">
              <TrophyIcon className="size-6 text-amber-500 drop-shadow-[0_0_8px_oklch(0.8_0.15_80)]" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter">Goals</h1>
              <p className="text-sm text-muted-foreground/80">
                {activeCount} active &middot; {completedCount} completed
              </p>
            </div>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="glow-primary">Create Goal</Button>
        </div>
      </div>

      {goalsList.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 p-12 text-center">
          <div className="mx-auto flex flex-col items-center gap-4">
            <TrophyIcon className="size-16 text-primary/30 animate-float" />
            <div className="space-y-2">
              <h3 className="text-xl font-black tracking-tighter gradient-text">No goals yet</h3>
              <p className="text-sm text-muted-foreground/80 max-w-md mx-auto">
                Set your first fitness goal and start tracking your progress.
              </p>
            </div>
            <Button onClick={() => setDialogOpen(true)} className="glow-primary">
              Create Goal
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {goalsList.map((goal, idx) => (
            <div
              key={goal.id}
              className="animate-slide-up"
              style={{ animationDelay: `${Math.min(idx * 50, 200)}ms` }}
            >
              <GoalCard
                goal={goal}
                onUpdateProgress={handleUpdateProgress}
                onComplete={handleComplete}
                onDelete={(id) => deleteGoalMutation.mutate(id, {
                  onSuccess: () => toast.success("Goal deleted"),
                  onError: (err) => toast.error(err.message || "Failed to delete goal"),
                })}
                isUpdating={updateGoal.isPending}
              />
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
          </DialogHeader>
          <CreateGoalForm
            onSubmit={handleCreateGoal}
            isSubmitting={createGoal.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
