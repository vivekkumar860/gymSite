import type { Metadata } from "next";
import { ExerciseDetailView } from "@/features/exercise";

type ExerciseDetailPageProps = {
  params: Promise<{ exerciseId: string }>;
};

export const metadata: Metadata = {
  title: "Exercise Detail - FitTrack",
};

export default async function ExerciseDetailPage({
  params,
}: ExerciseDetailPageProps) {
  const { exerciseId } = await params;
  return <ExerciseDetailView exerciseId={exerciseId} />;
}
