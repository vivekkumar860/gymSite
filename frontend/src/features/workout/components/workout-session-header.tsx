"use client";

import type { WorkoutStatus } from "../types/workout.types";
import { WorkoutTimer } from "./workout-timer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayIcon, CheckCircleIcon } from "lucide-react";

type WorkoutSessionHeaderProps = {
  name: string;
  exerciseCount: number;
  status: WorkoutStatus;
  startedAt?: string;
  onStart?: () => void;
  onComplete?: () => void;
  isStarting?: boolean;
  isCompleting?: boolean;
};

const statusLabel: Record<WorkoutStatus, string> = {
  planned: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
  skipped: "Skipped",
};

const statusVariant: Record<WorkoutStatus, "default" | "secondary" | "destructive" | "outline"> = {
  planned: "outline",
  in_progress: "secondary",
  completed: "default",
  skipped: "destructive",
};

export function WorkoutSessionHeader({
  name,
  exerciseCount,
  status,
  startedAt,
  onStart,
  onComplete,
  isStarting = false,
  isCompleting = false,
}: WorkoutSessionHeaderProps) {
  const isActive = status === "in_progress";
  const isPlanned = status === "planned";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">{name}</h2>
          <Badge variant={statusVariant[status]}>{statusLabel[status]}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {exerciseCount} exercise{exerciseCount !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {isActive && (
          <WorkoutTimer startedAt={startedAt} isActive />
        )}

        {isPlanned && onStart && (
          <Button onClick={onStart} disabled={isStarting}>
            <PlayIcon className="mr-1.5 size-4" />
            {isStarting ? "Starting..." : "Start Workout"}
          </Button>
        )}

        {isActive && onComplete && (
          <Button onClick={onComplete} disabled={isCompleting}>
            <CheckCircleIcon className="mr-1.5 size-4" />
            {isCompleting ? "Completing..." : "Complete"}
          </Button>
        )}
      </div>
    </div>
  );
}
