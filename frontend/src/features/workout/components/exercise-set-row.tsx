"use client";

import type { ExerciseSet } from "../types/workout.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ExerciseSetRowProps = {
  set: ExerciseSet;
  setIndex: number;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function ExerciseSetRow({ set, setIndex, onEdit, onDelete }: ExerciseSetRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-primary/5",
        set.isWarmup && "text-muted-foreground italic",
        set.isFailure && "text-destructive/70 line-through",
      )}
      onClick={onEdit}
      role={onEdit ? "button" : undefined}
      tabIndex={onEdit ? 0 : undefined}
    >
      <span className="w-8 shrink-0 font-mono font-medium text-muted-foreground">
        {setIndex + 1}
      </span>

      <span className="flex-1 font-mono text-sm">
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
          <span className="font-mono text-xs text-muted-foreground">RPE {set.rpe}</span>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="size-6 text-destructive/50 hover:text-destructive"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
          >
            <TrashIcon className="size-3" />
            <span className="sr-only">Delete set</span>
          </Button>
        )}
      </div>
    </div>
  );
}
