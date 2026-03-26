"use client";

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import type { NutrientProgressData } from "../types/dashboard.types";

type NutrientProgressCardProps = NutrientProgressData & {
  label: string;
};

export function NutrientProgressCard({
  current,
  target,
  unit,
  label,
}: NutrientProgressCardProps) {
  const percentage = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;
  const remaining = Math.max(target - current, 0);

  return (
    <div className="space-y-2">
      <Progress value={percentage} max={100}>
        <ProgressLabel>{label}</ProgressLabel>
        <ProgressValue>
          {() => `${current} / ${target} ${unit}`}
        </ProgressValue>
      </Progress>

      <p className="text-xs text-muted-foreground">
        {remaining > 0
          ? `${remaining} ${unit} remaining`
          : "Target reached"}
      </p>
    </div>
  );
}
