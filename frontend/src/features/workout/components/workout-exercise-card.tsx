"use client";

import type { WorkoutExercise } from "../types/workout.types";
import { ExerciseSetRow } from "./exercise-set-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

type WorkoutExerciseCardProps = {
  exercise: WorkoutExercise;
  onLogSet?: (exerciseId: string) => void;
};

export function WorkoutExerciseCard({
  exercise,
  onLogSet,
}: WorkoutExerciseCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{exercise.exerciseName}</CardTitle>
        {exercise.notes && (
          <p className="text-xs text-muted-foreground">{exercise.notes}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        {exercise.sets.length === 0 && (
          <p className="py-2 text-sm text-muted-foreground">
            No sets logged yet.
          </p>
        )}
        {exercise.sets.map((set, idx) => (
          <ExerciseSetRow key={set.id} set={set} setIndex={idx} />
        ))}

        {onLogSet && (
          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full"
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
