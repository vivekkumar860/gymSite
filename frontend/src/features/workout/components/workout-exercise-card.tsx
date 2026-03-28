"use client";

import type { WorkoutExercise } from "../types/workout.types";
import { ExerciseSetRow } from "./exercise-set-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

type WorkoutExerciseCardProps = {
  exercise: WorkoutExercise;
  exerciseIndex?: number;
  onLogSet?: (exerciseId: string) => void;
  onDeleteSet?: (setId: string) => void;
};

export function WorkoutExerciseCard({
  exercise,
  exerciseIndex,
  onLogSet,
  onDeleteSet,
}: WorkoutExerciseCardProps) {
  return (
    <Card className="glass card-depth-2 rounded-2xl border-border/30 border-glow overflow-hidden">
      {/* Top gradient strip */}
      <div className="h-1 bg-gradient-to-r from-primary to-purple-500/60" />
      <CardHeader>
        <div className="flex items-center gap-2.5">
          {exerciseIndex != null && (
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
              {exerciseIndex + 1}
            </span>
          )}
          <CardTitle className="text-base font-bold">{exercise.exerciseName}</CardTitle>
        </div>
        {exercise.notes && (
          <p className="text-xs text-muted-foreground/80 italic">{exercise.notes}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        {exercise.sets.length === 0 && (
          <p className="py-2 text-sm text-muted-foreground/80">
            No sets logged yet.
          </p>
        )}
        {exercise.sets.map((set, idx) => (
          <ExerciseSetRow
            key={set.id}
            set={set}
            setIndex={idx}
            onDelete={onDeleteSet ? () => onDeleteSet(set.id) : undefined}
          />
        ))}

        {onLogSet && (
          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
            onClick={() => onLogSet(exercise.id)}
          >
            <PlusIcon className="size-4" />
            Log Set
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
