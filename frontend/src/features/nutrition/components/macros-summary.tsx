"use client";

import type { Macros } from "@/api/schemas/nutrition.schema";
import { cn } from "@/lib/utils";
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress";

type MacrosSummaryProps = {
  current: Macros;
  target: Macros;
  className?: string;
};

const macroConfig = [
  { key: "calories" as const, label: "Calories", unit: "kcal", color: "bg-blue-500" },
  { key: "protein" as const, label: "Protein", unit: "g", color: "bg-red-500" },
  { key: "carbs" as const, label: "Carbs", unit: "g", color: "bg-yellow-500" },
  { key: "fat" as const, label: "Fat", unit: "g", color: "bg-green-500" },
] as const;

export function MacrosSummary({ current, target, className }: MacrosSummaryProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {macroConfig.map(({ key, label, unit, color }) => {
        const currentVal = current[key];
        const targetVal = target[key];
        const percentage = targetVal > 0 ? Math.min((currentVal / targetVal) * 100, 100) : 0;

        return (
          <div key={key} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{label}</span>
              <span className="text-muted-foreground">
                {Math.round(currentVal)} / {Math.round(targetVal)} {unit}
              </span>
            </div>
            <Progress value={percentage}>
              <ProgressTrack>
                <ProgressIndicator className={color} />
              </ProgressTrack>
            </Progress>
          </div>
        );
      })}
    </div>
  );
}
