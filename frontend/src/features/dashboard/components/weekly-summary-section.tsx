"use client";

import { useWeeklySummary } from "../hooks/use-weekly-summary";
import { WeeklySummaryCard } from "./weekly-summary-card";
import { SectionShell } from "./section-shell";
import { SECTION_LABELS } from "../constants/dashboard-constants";

export function WeeklySummarySection() {
  const { data, isLoading, isError, refetch } = useWeeklySummary();

  return (
    <SectionShell
      title={SECTION_LABELS.weeklySummary}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      isEmpty={!data}
      emptyMessage="Weekly overview coming soon."
    >
      {data && (
        <WeeklySummaryCard
          days={data.days}
          workoutsCompleted={data.workoutsCompleted}
          workoutsPlanned={data.workoutsPlanned}
        />
      )}
    </SectionShell>
  );
}
