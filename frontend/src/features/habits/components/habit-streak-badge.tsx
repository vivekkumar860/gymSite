"use client";

import { Badge } from "@/components/ui/badge";

type HabitStreakBadgeProps = {
  currentStreak: number;
  longestStreak: number;
};

export function HabitStreakBadge({
  currentStreak,
  longestStreak,
}: HabitStreakBadgeProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Badge
        variant={currentStreak > 0 ? "default" : "secondary"}
        className="gap-1"
      >
        {currentStreak > 0 && (
          <span aria-hidden="true" role="img">
            🔥
          </span>
        )}
        {currentStreak}d
      </Badge>
      {longestStreak > 0 && (
        <span className="text-xs text-muted-foreground">
          Best: {longestStreak}d
        </span>
      )}
    </div>
  );
}
