"use client";

import type { WorkoutStatus } from "../types/workout.types";
import { WorkoutTimer } from "./workout-timer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayIcon, CheckCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

const statusDotClass: Record<WorkoutStatus, string> = {
  planned: "bg-amber-400",
  in_progress: "bg-green-400 animate-pulse",
  completed: "bg-blue-400",
  skipped: "bg-muted-foreground",
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
    <div className="glass card-depth-2 rounded-2xl border-border/30 p-5 animate-slide-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black tracking-tighter">{name}</h2>
            <div className="flex items-center gap-1.5 rounded-full glass px-2.5 py-1">
              <span className={cn("size-2 rounded-full", statusDotClass[status])} />
              <span className="text-xs font-medium">{statusLabel[status]}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground/80">
            {exerciseCount} exercise{exerciseCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isActive && (
            <WorkoutTimer startedAt={startedAt} isActive />
          )}

          {isPlanned && onStart && (
            <Button onClick={onStart} disabled={isStarting} className="glow-primary">
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
    </div>
  );
}
