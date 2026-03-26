import type { Metadata } from "next";
import { TodayWorkoutView } from "@/features/workout";

export const metadata: Metadata = {
  title: "Today's Workout - FitTrack",
};

export default function TodayWorkoutPage() {
  return <TodayWorkoutView />;
}
