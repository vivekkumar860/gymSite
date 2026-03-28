"use client";

import Image from "next/image";
import type { ExerciseSummary } from "../types/exercise.types";
import { Badge } from "@/components/ui/badge";

type ExerciseCardProps = {
  exercise: ExerciseSummary;
  onClick?: () => void;
};

const DIFFICULTY_COLORS: Record<string, string> = {
  BEGINNER: "bg-green-500/80 text-white",
  INTERMEDIATE: "bg-amber-500/80 text-white",
  ADVANCED: "bg-rose-500/80 text-white",
};

export function ExerciseCard({ exercise, onClick }: ExerciseCardProps) {
  return (
    <div
      className="glass card-depth-2 rounded-2xl border-border/30 overflow-hidden cursor-pointer interactive group"
      onClick={onClick}
    >
      {/* Image with overlay */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {exercise.imageUrl ? (
          <Image
            src={exercise.imageUrl}
            alt={exercise.exerciseName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-purple-500/10">
            <span className="text-2xl font-black text-primary/30">
              {exercise.exerciseName.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Name on image */}
        <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between gap-2">
          <p className="text-sm font-bold text-white drop-shadow-lg truncate">{exercise.exerciseName}</p>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${DIFFICULTY_COLORS[exercise.difficulty] ?? "bg-muted text-muted-foreground"}`}>
            {exercise.difficulty}
          </span>
        </div>
      </div>

      {/* Badges below image */}
      <div className="p-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20">
            {exercise.primaryMuscle.replace(/_/g, " ")}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {exercise.equipment.replace(/_/g, " ")}
          </Badge>
        </div>
      </div>
    </div>
  );
}
