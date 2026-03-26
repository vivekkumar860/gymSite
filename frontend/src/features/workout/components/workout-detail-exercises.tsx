"use client";

import type { WorkoutExercise } from "../types/workout.types";
import { ExerciseSetRow } from "./exercise-set-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WorkoutDetailExercisesProps = {
  exercises: WorkoutExercise[];
};

export function WorkoutDetailExercises({ exercises }: WorkoutDetailExercisesProps) {
  if (exercises.length === 0) {
    return (
      <p className="py-4 text-sm text-muted-foreground">
        No exercises in this workout.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {exercises.map((exercise) => (
        <Card key={exercise.id}>
          <CardHeader>
            <CardTitle>{exercise.exerciseName}</CardTitle>
            {exercise.notes && (
              <p className="text-xs text-muted-foreground">{exercise.notes}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-1">
            {exercise.sets.length === 0 ? (
              <p className="py-2 text-sm text-muted-foreground">
                No sets logged.
              </p>
            ) : (
              exercise.sets.map((set, idx) => (
                <ExerciseSetRow key={set.id} set={set} setIndex={idx} />
              ))
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
