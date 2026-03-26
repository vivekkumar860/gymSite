"use client";

import { useSleepSummary } from "../hooks/use-sleep-summary";
import { SleepSummaryCard } from "./sleep-summary-card";
import { SectionShell } from "./section-shell";
import { SECTION_LABELS } from "../constants/dashboard-constants";

export function SleepSummarySection() {
  const { data, isLoading, isError, refetch } = useSleepSummary();

  return (
    <SectionShell
      title={SECTION_LABELS.sleepSummary}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      isEmpty={!data}
      emptyMessage="Sleep tracking coming soon."
    >
      {data && (
        <SleepSummaryCard
          hoursSlept={data.hoursSlept}
          targetHours={data.targetHours}
          quality={data.quality}
          bedtime={data.bedtime}
          wakeTime={data.wakeTime}
        />
      )}
    </SectionShell>
  );
}
