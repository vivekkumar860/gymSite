"use client";

import type { Workout } from "../types/workout.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon, ClockIcon, DumbbellIcon, LayersIcon } from "lucide-react";

type WorkoutSummaryCardProps = {
  workout: Workout;
};

export function WorkoutSummaryCard({ workout }: WorkoutSummaryCardProps) {
  const totalSets = workout.exercises.reduce(
    (sum, ex) => sum + ex.sets.length,
    0,
  );
  const totalVolume = workout.exercises.reduce(
    (sum, ex) =>
      sum +
      ex.sets.reduce(
        (s, set) => s + set.repsCompleted * (set.weightKg ?? 0),
        0,
      ),
    0,
  );
  const durationMinutes = workout.duration
    ? Math.round(workout.duration / 60)
    : null;

  return (
    <Card className="border-green-500/30 bg-green-50/50 dark:bg-green-950/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircleIcon className="size-5 text-green-500" />
          <CardTitle>Workout Complete</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <SummaryStat
            icon={<DumbbellIcon className="size-4" />}
            label="Exercises"
            value={String(workout.exercises.length)}
          />
          <SummaryStat
            icon={<LayersIcon className="size-4" />}
            label="Sets"
            value={String(totalSets)}
          />
          <SummaryStat
            icon={<Badge variant="secondary" className="size-4 p-0 flex items-center justify-center text-[10px]">V</Badge>}
            label="Volume"
            value={`${totalVolume.toLocaleString()} kg`}
          />
          {durationMinutes != null && (
            <SummaryStat
              icon={<ClockIcon className="size-4" />}
              label="Duration"
              value={`${durationMinutes} min`}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}
