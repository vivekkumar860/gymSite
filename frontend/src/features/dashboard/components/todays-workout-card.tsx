"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Workout } from "@/api/schemas/workout.schema";

type TodaysWorkoutCardProps = {
  workout: Workout;
  onStartWorkout: () => void;
  onViewWorkout: () => void;
};

const STATUS_LABELS: Record<string, string> = {
  planned: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
  skipped: "Skipped",
};

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "outline"> = {
  planned: "outline",
  in_progress: "default",
  completed: "secondary",
  skipped: "outline",
};

export function TodaysWorkoutCard({
  workout,
  onStartWorkout,
  onViewWorkout,
}: TodaysWorkoutCardProps) {
  const isCompleted = workout.status === "completed";
  const isInProgress = workout.status === "in_progress";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{workout.name}</h3>
        <Badge variant={STATUS_VARIANTS[workout.status] ?? "outline"}>
          {STATUS_LABELS[workout.status] ?? workout.status}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        {workout.exercises.length} exercise{workout.exercises.length !== 1 ? "s" : ""}
        {workout.duration != null && ` \u00B7 ${workout.duration} min`}
      </p>

      <div className="flex gap-2">
        {!isCompleted && (
          <Button size="sm" onClick={onStartWorkout}>
            {isInProgress ? "Continue" : "Start"}
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={onViewWorkout}>
          {isCompleted ? "Review" : "Details"}
        </Button>
      </div>
    </div>
  );
}
