"use client";

import { useRouter } from "next/navigation";
import { useTodaysWorkout } from "../hooks/use-todays-workout";
import { TodaysWorkoutCard } from "./todays-workout-card";
import { SectionShell } from "./section-shell";
import { SECTION_LABELS } from "../constants/dashboard-constants";
import { ROUTES } from "@/config/routes";

export function TodaysWorkoutSection() {
  const router = useRouter();
  const { data: workout, isLoading, isError, refetch } = useTodaysWorkout();

  return (
    <SectionShell
      title={SECTION_LABELS.todaysWorkout}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      isEmpty={!workout}
      emptyMessage="No workout scheduled for today."
      emptyAction={{
        label: "Create Workout Plan",
        onClick: () => router.push(ROUTES.workout.plan),
      }}
    >
      {workout && (
        <TodaysWorkoutCard
          workout={workout}
          onStartWorkout={() => router.push(ROUTES.workout.today)}
          onViewWorkout={() => router.push(ROUTES.workout.today)}
        />
      )}
    </SectionShell>
  );
}
