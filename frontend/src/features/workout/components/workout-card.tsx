"use client";

import type { WorkoutSummary } from "../types/workout.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

type WorkoutCardProps = {
  workout: WorkoutSummary;
  onClick?: () => void;
};

const statusVariant: Record<
  WorkoutSummary["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  planned: "outline",
  in_progress: "secondary",
  completed: "default",
  skipped: "destructive",
};

const statusLabel: Record<WorkoutSummary["status"], string> = {
  planned: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
  skipped: "Skipped",
};

export function WorkoutCard({ workout, onClick }: WorkoutCardProps) {
  const formattedDate = format(parseISO(workout.date), "MMM d, yyyy");
  const totalVolume = workout.totalVolume.toLocaleString();

  return (
    <Card
      className={onClick ? "cursor-pointer transition-shadow hover:shadow-md" : ""}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{workout.name}</CardTitle>
          <Badge variant={statusVariant[workout.status]}>
            {statusLabel[workout.status]}
          </Badge>
        </div>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{workout.exerciseCount} exercises</span>
          <span>{workout.totalSets} sets</span>
          <span>{totalVolume} kg volume</span>
        </div>
        {workout.duration != null && (
          <p className="mt-1 text-xs text-muted-foreground">
            {Math.round(workout.duration / 60)} min
          </p>
        )}
      </CardContent>
    </Card>
  );
}
