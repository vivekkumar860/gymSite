import type { Metadata } from "next";
import { HabitsTrackerView } from "@/features/habits";

export const metadata: Metadata = {
  title: "Habits - FitTrack",
};

export default function HabitsPage() {
  return <HabitsTrackerView />;
}
