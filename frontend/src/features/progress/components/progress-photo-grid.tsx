"use client";

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
          <div className="aspect-square rounded-lg bg-muted flex items-center justify-center overflow-hidden">
            {photo.imageUrl ? (
              <img
                src={photo.imageUrl}
                alt={`Progress photo from ${photo.date}`}
                className="size-full object-cover"
              />
            ) : (
              <span className="text-xs text-muted-foreground">No image</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {photo.date}
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
