"use client";

import { useCalorieProgress } from "../hooks/use-calorie-progress";
import { NutrientProgressCard } from "./nutrient-progress-card";
import { SectionShell } from "./section-shell";
import { SECTION_LABELS } from "../constants/dashboard-constants";

export function CalorieProgressSection() {
  const { data, isLoading, isError, refetch } = useCalorieProgress();

  return (
    <SectionShell
      title={SECTION_LABELS.calorieProgress}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
    >
      {data && (
        <NutrientProgressCard
          label="Calories"
          current={data.current}
          target={data.target}
          unit={data.unit}
        />
      )}
    </SectionShell>
  );
}
