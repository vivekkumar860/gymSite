import type { Metadata } from "next";
import { WorkoutHistoryList } from "@/features/workout";

export const metadata: Metadata = {
  title: "Workout History - FitTrack",
};

export default function WorkoutHistoryPage() {
  return <WorkoutHistoryList />;
}
