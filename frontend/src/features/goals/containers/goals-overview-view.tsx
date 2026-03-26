"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useGoals } from "../hooks/use-goals";
import { useCreateGoal } from "../hooks/use-create-goal";
import { GoalList } from "../components/goal-list";
import { CreateGoalForm } from "../components/create-goal-form";
import { PageHeader } from "@/shared/components/page-header";
import { LoadingSkeleton } from "@/shared/components/loading-skeleton";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CreateGoalSchema } from "../schemas/create-goal-schema";

export function GoalsOverviewView() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { goals, isLoading, error } = useGoals();
  const createGoal = useCreateGoal();

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

  if (isLoading) {
    return <LoadingSkeleton variant="card" count={4} />;
  }

  if (error) {
    return <ErrorBoundaryCard message="Failed to load goals." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Goals" description="Set and track your fitness goals.">
        <Button onClick={() => setDialogOpen(true)}>Create Goal</Button>
      </PageHeader>

      <GoalList goals={goals ?? []} />

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
