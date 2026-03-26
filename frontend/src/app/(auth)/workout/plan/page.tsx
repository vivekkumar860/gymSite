import type { Metadata } from "next";
import { PageHeader } from "@/shared/components/page-header";

export const metadata: Metadata = {
  title: "Workout Plan - FitTrack",
};

export default function WorkoutPlanPage() {
  return (
    <div>
      <PageHeader
        title="Workout Plan"
        description="View and manage your weekly workout plan"
      />
      {/* WorkoutPlanView container will be built during page implementation */}
    </div>
  );
}
