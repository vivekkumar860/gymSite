import type { Metadata } from "next";
import { Suspense } from "react";
import { ExerciseLibraryView } from "@/features/exercise";
import { LoadingSkeleton } from "@/shared/components/loading-skeleton";

export const metadata: Metadata = {
  title: "Exercise Library - FitTrack",
};

export default function ExercisesPage() {
  return (
    <Suspense fallback={<LoadingSkeleton variant="card" />}>
      <ExerciseLibraryView />
    </Suspense>
  );
}
