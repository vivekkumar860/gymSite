"use client";

import type { Exercise } from "../types/exercise.types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLinkIcon } from "lucide-react";

type ExerciseDetailCardProps = {
  exercise: Exercise;
};

export function ExerciseDetailCard({ exercise }: ExerciseDetailCardProps) {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Hero image */}
      <div className="relative overflow-hidden rounded-2xl">
        {exercise.videoUrl ? (
          <VideoEmbed url={exercise.videoUrl} />
        ) : (
          <div className="flex h-48 items-center justify-center bg-gradient-to-br from-primary/15 via-purple-500/10 to-primary/5">
            <span className="text-5xl font-black text-primary/20">
              {exercise.exerciseName.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <h1 className="absolute bottom-4 left-5 text-3xl font-black text-white drop-shadow-lg">
          {exercise.exerciseName}
        </h1>
      </div>

      {/* Content card */}
      <div className="glass card-depth-2 rounded-2xl border-border/30 p-6 space-y-6">
        {/* Difficulty & Equipment */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-primary/10 text-primary border-primary/20">{exercise.difficulty}</Badge>
          {exercise.equipment && (
            <Badge variant="outline">{exercise.equipment}</Badge>
          )}
        </div>

        <Separator className="bg-border/30" />

        {/* Primary Muscle */}
        <div className="space-y-2">
          <h4 className="font-mono text-xs uppercase tracking-widest text-primary/60">Primary Muscle</h4>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {exercise.primaryMuscle.replace("_", " ")}
          </Badge>
        </div>

        {/* Secondary Muscle */}
        {exercise.secondaryMuscle && (
          <div className="space-y-2">
            <h4 className="font-mono text-xs uppercase tracking-widest text-primary/60">Secondary Muscle</h4>
            <Badge variant="outline">
              {exercise.secondaryMuscle.replace("_", " ")}
            </Badge>
          </div>
        )}

        <Separator className="bg-border/30" />

        {/* Instructions */}
        {exercise.instructions && (
          <div className="space-y-2">
            <h4 className="font-mono text-xs uppercase tracking-widest text-primary/60">Instructions</h4>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">{exercise.instructions}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function VideoEmbed({ url }: { url: string }) {
  // YouTube: youtu.be/{id} or youtube.com/watch?v={id}
  const ytMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/,
  );
  if (ytMatch) {
    return (
      <div className="aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${ytMatch[1]}`}
          title="Exercise video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full rounded-2xl"
        />
      </div>
    );
  }

  // Vimeo: vimeo.com/{id}
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return (
      <div className="aspect-video w-full">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
          title="Exercise video"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="h-full w-full rounded-2xl"
        />
      </div>
    );
  }

  // Direct video file
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) {
    return (
      <video
        src={url}
        controls
        className="aspect-video w-full rounded-2xl bg-black"
      />
    );
  }

  // Fallback: link to external video
  return (
    <div className="flex h-48 items-center justify-center bg-muted rounded-2xl">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-primary hover:underline"
      >
        <ExternalLinkIcon className="size-4" />
        Watch video externally
      </a>
    </div>
  );
}
