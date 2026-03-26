"use client";

import { useStreakCount } from "../hooks/use-streak-count";
import { StreakCountCard } from "./streak-count-card";
import { SectionShell } from "./section-shell";
import { SECTION_LABELS } from "../constants/dashboard-constants";

export function StreakCountSection() {
  const { data, isLoading, isError, refetch } = useStreakCount();

  return (
    <SectionShell
      title={SECTION_LABELS.streakCount}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
    >
      {data && (
        <StreakCountCard
          currentStreak={data.currentStreak}
          longestStreak={data.longestStreak}
        />
      )}
    </SectionShell>
  );
}
