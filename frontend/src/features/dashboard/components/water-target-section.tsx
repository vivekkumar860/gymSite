"use client";

import { useWaterTarget, useLogWater } from "../hooks/use-water-target";
import { WaterTargetCard } from "./water-target-card";
import { SectionShell } from "./section-shell";
import { SECTION_LABELS } from "../constants/dashboard-constants";

export function WaterTargetSection() {
  const { data, isLoading, isError, refetch } = useWaterTarget();
  const logWater = useLogWater();

  return (
    <SectionShell
      title={SECTION_LABELS.waterTarget}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      isEmpty={!data}
      emptyMessage="Water tracking coming soon."
    >
      {data && (
        <WaterTargetCard
          currentMl={data.currentMl}
          targetMl={data.targetMl}
          logs={data.logs}
          onLogWater={(amount) => logWater.mutate(amount)}
          isLogging={logWater.isPending}
        />
      )}
    </SectionShell>
  );
}
