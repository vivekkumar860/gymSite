"use client";

import { useWeightTrend } from "../hooks/use-weight-trend";
import { WeightTrendCard } from "./weight-trend-card";
import { SectionShell } from "./section-shell";
import { SECTION_LABELS } from "../constants/dashboard-constants";

export function WeightTrendSection() {
  const { data, isLoading, isError, refetch } = useWeightTrend();

  return (
    <SectionShell
      title={SECTION_LABELS.weightTrend}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      isEmpty={data?.entries.length === 0}
      emptyMessage="No weight data recorded yet."
    >
      {data && data.entries.length > 0 && (
        <WeightTrendCard
          entries={data.entries}
          currentWeight={data.currentWeight}
          changeFromLast={data.changeFromLast}
          unit={data.unit}
        />
      )}
    </SectionShell>
  );
}
