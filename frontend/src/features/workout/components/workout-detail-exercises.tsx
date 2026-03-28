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
      <p className="py-4 text-sm text-muted-foreground/80">
        No exercises in this workout.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {exercises.map((exercise, idx) => (
        <Card
          key={exercise.id}
          className="glass card-depth-2 rounded-2xl border-border/30 border-glow overflow-hidden animate-slide-up"
          style={{ animationDelay: `${idx * 50}ms` }}
        >
          <div className="h-1 bg-gradient-to-r from-primary to-purple-500/60" />
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                {idx + 1}
              </span>
              <CardTitle className="text-base font-bold">{exercise.exerciseName}</CardTitle>
            </div>
            {exercise.notes && (
              <p className="text-xs text-muted-foreground/80 italic">{exercise.notes}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-1">
            {exercise.sets.length === 0 ? (
              <p className="py-2 text-sm text-muted-foreground/80">
                No sets logged.
              </p>
            ) : (
              exercise.sets.map((set, setIdx) => (
                <ExerciseSetRow key={set.id} set={set} setIndex={setIdx} />
              ))
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
