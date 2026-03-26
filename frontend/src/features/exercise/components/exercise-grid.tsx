"use client";

import type { ExerciseSummary } from "../types/exercise.types";
import { ExerciseCard } from "./exercise-card";

type ExerciseGridProps = {
  exercises: ExerciseSummary[];
  onExerciseClick?: (id: string) => void;
};

export function ExerciseGrid({ exercises, onExerciseClick }: ExerciseGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          onClick={() => onExerciseClick?.(exercise.slug)}
        />
      ))}
    </div>
  );
}
