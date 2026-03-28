"use client";

import type { Workout } from "../types/workout.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="glass card-depth-2 rounded-2xl border-green-500/20 bg-green-500/5 animate-scale-in">
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
            icon={<span className="text-xs font-bold">V</span>}
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
        <span className="font-mono text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-lg font-black tabular-nums">{value}</span>
    </div>
  );
}
