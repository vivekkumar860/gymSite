import type { Metadata } from "next";
import { GoalsOverviewView } from "@/features/goals";

export const metadata: Metadata = {
  title: "Goals - FitTrack",
};

export default function GoalsPage() {
  return <GoalsOverviewView />;
}
