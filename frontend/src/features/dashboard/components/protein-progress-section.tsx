"use client";

import { useProteinProgress } from "../hooks/use-protein-progress";
import { NutrientProgressCard } from "./nutrient-progress-card";
import { SectionShell } from "./section-shell";
import { SECTION_LABELS } from "../constants/dashboard-constants";

export function ProteinProgressSection() {
  const { data, isLoading, isError, refetch } = useProteinProgress();

  return (
    <SectionShell
      title={SECTION_LABELS.proteinProgress}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
    >
      {data && (
        <NutrientProgressCard
          label="Protein"
          current={data.current}
          target={data.target}
          unit={data.unit}
        />
      )}
    </SectionShell>
  );
}
