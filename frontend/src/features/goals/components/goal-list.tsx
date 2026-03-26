"use client";

import type { GoalResponse } from "@/api/services/goals.service";
import { GoalCard } from "./goal-card";

type GoalListProps = {
  goals: GoalResponse[];
};

export function GoalList({ goals }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No goals yet. Create one to get started!
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}
