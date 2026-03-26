"use client";

import {
  useHabitsChecklist,
  useToggleHabit,
} from "../hooks/use-habits-checklist";
import { HabitsChecklistCard } from "./habits-checklist-card";
import { SectionShell } from "./section-shell";
import { SECTION_LABELS } from "../constants/dashboard-constants";

export function HabitsChecklistSection() {
  const { data: habits, isLoading, isError, refetch } = useHabitsChecklist();
  const toggleHabit = useToggleHabit();

  return (
    <SectionShell
      title={SECTION_LABELS.habitsChecklist}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      isEmpty={habits?.length === 0}
      emptyMessage="No habits set up yet."
    >
      {habits && habits.length > 0 && (
        <HabitsChecklistCard
          habits={habits}
          onToggle={(habitId, completed) =>
            toggleHabit.mutate({ habitId, completed })
          }
          isToggling={toggleHabit.isPending}
        />
      )}
    </SectionShell>
  );
}
