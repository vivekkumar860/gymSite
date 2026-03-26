"use client";

import type { ExerciseSet } from "../types/workout.types";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "lucide-react";

type ExerciseSetRowProps = {
  set: ExerciseSet;
  setIndex: number;
  onEdit?: () => void;
};

export function ExerciseSetRow({ set, setIndex, onEdit }: ExerciseSetRowProps) {
  return (
    <div
      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted/50"
      onClick={onEdit}
      role={onEdit ? "button" : undefined}
      tabIndex={onEdit ? 0 : undefined}
    >
      <span className="w-8 shrink-0 font-medium text-muted-foreground">
        {setIndex + 1}
      </span>

      <span className="flex-1">
        {set.repsCompleted} reps
        {set.weightKg != null && <> &times; {set.weightKg} kg</>}
      </span>

      <div className="flex items-center gap-1.5">
        {set.isWarmup && (
          <Badge variant="outline" className="text-xs">
            Warmup
          </Badge>
        )}
        {set.isFailure && (
          <Badge variant="secondary" className="text-xs">
            Failure
          </Badge>
        )}
        {set.rpe != null && (
          <span className="text-xs text-muted-foreground">RPE {set.rpe}</span>
        )}
      </div>
    </div>
  );
}
