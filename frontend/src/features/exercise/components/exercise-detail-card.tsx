"use client";

import type { Exercise } from "../types/exercise.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type ExerciseDetailCardProps = {
  exercise: Exercise;
};

export function ExerciseDetailCard({ exercise }: ExerciseDetailCardProps) {
  return (
    <Card>
      {exercise.videoUrl ? (
        <div className="flex h-64 items-center justify-center rounded-t-xl bg-muted text-muted-foreground">
          <span className="text-sm">Video: {exercise.videoUrl}</span>
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center rounded-t-xl bg-muted text-muted-foreground">
          <span className="text-sm">No media available</span>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-2xl">{exercise.exerciseName}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Difficulty & Equipment */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{exercise.difficulty}</Badge>
          {exercise.equipment && (
            <Badge variant="outline">{exercise.equipment}</Badge>
          )}
        </div>

        <Separator />

        {/* Primary Muscle */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Primary Muscle</h4>
          <Badge variant="secondary">
            {exercise.primaryMuscle.replace("_", " ")}
          </Badge>
        </div>

        {/* Secondary Muscle */}
        {exercise.secondaryMuscle && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Secondary Muscle</h4>
            <Badge variant="outline">
              {exercise.secondaryMuscle.replace("_", " ")}
            </Badge>
          </div>
        )}

        <Separator />

        {/* Instructions */}
        {exercise.instructions && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Instructions</h4>
            <p className="text-sm text-muted-foreground">{exercise.instructions}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
