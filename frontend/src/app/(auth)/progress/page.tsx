import type { Metadata } from "next";
import { ProgressOverviewView } from "@/features/progress";

export const metadata: Metadata = {
  title: "Progress - FitTrack",
};

export default function ProgressPage() {
  return <ProgressOverviewView />;
}
