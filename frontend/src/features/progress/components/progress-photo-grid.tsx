"use client";

import Image from "next/image";
import type { ProgressPhoto } from "@/api/schemas/progress.schema";

type ProgressPhotoGridProps = {
  photos: ProgressPhoto[];
};

export function ProgressPhotoGrid({ photos }: ProgressPhotoGridProps) {
  if (photos.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No progress photos yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo) => (
        <div key={photo.id} className="space-y-2">
          <div className="relative aspect-square rounded-lg bg-muted flex items-center justify-center overflow-hidden">
            {photo.storagePath ? (
              <Image
                src={photo.storagePath}
                alt={`Progress photo — ${photo.pose} from ${photo.takenAt}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
              />
            ) : (
              <span className="text-xs text-muted-foreground">No image</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {new Date(photo.takenAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          {photo.notes && (
            <p className="text-xs text-muted-foreground text-center truncate">
              {photo.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
