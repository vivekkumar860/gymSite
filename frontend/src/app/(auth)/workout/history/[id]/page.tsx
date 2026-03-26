import type { Metadata } from "next";
import { WorkoutDetailView } from "@/features/workout";

type WorkoutDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Workout Details - FitTrack",
};

export default async function WorkoutDetailPage({
  params,
}: WorkoutDetailPageProps) {
  const { id } = await params;
  return <WorkoutDetailView workoutId={id} />;
}
