"use client";

import type { StreakCountResponse } from "@/api/schemas/dashboard.schema";

type StreakCountCardProps = StreakCountResponse;

export function StreakCountCard({
  currentStreak,
  longestStreak,
}: StreakCountCardProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold tabular-nums">
          {currentStreak}
        </span>
        <span className="text-sm text-muted-foreground">days</span>
      </div>

      <p className="text-xs text-muted-foreground">
        Best: {longestStreak} day{longestStreak !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
