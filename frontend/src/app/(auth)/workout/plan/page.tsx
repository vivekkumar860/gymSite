import type { Metadata } from "next";
import { WorkoutPlanView } from "@/features/workout";

export const metadata: Metadata = {
  title: "Workout Plan - FitTrack",
};

export default function WorkoutPlanPage() {
  return <WorkoutPlanView />;
}
