"use client";

import type { ExerciseSummary } from "../types/exercise.types";
import { ExerciseCard } from "./exercise-card";

type ExerciseGridProps = {
  exercises: ExerciseSummary[];
  onExerciseClick?: (id: string) => void;
};

export function ExerciseGrid({ exercises, onExerciseClick }: ExerciseGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {exercises.map((exercise, idx) => (
        <div
          key={exercise.id}
          className="animate-slide-up"
          style={{ animationDelay: `${Math.min(idx * 50, 200)}ms` }}
        >
          <ExerciseCard
            exercise={exercise}
            onClick={() => onExerciseClick?.(exercise.slug)}
          />
        </div>
      ))}
    </div>
  );
}
