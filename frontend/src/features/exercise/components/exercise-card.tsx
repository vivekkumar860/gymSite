"use client";

import type { ExerciseSummary } from "../types/exercise.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ExerciseCardProps = {
  exercise: ExerciseSummary;
  onClick?: () => void;
};

export function ExerciseCard({ exercise, onClick }: ExerciseCardProps) {
  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>{exercise.exerciseName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Badge variant="secondary">{exercise.difficulty}</Badge>
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            {exercise.primaryMuscle.replace("_", " ")}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
