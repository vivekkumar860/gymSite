"use client";

import type { WeeklySummaryResponse } from "@/api/schemas/dashboard.schema";

type WeeklySummaryCardProps = WeeklySummaryResponse;

export function WeeklySummaryCard({
  days,
  workoutsCompleted,
  workoutsPlanned,
}: WeeklySummaryCardProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {workoutsCompleted} of {workoutsPlanned} workout{workoutsPlanned !== 1 ? "s" : ""} completed
      </p>

      <div className="grid grid-cols-7 gap-1" role="list" aria-label="Weekly activity">
        {days.map((day) => {
          const habitsPercent =
            day.habitsTotal > 0
              ? Math.round((day.habitsCompleted / day.habitsTotal) * 100)
              : 0;

          return (
            <div
              key={day.date}
              role="listitem"
              className="flex flex-col items-center gap-1"
              aria-label={`${day.dayLabel}: workout ${day.workoutCompleted ? "completed" : "not completed"}, ${day.habitsCompleted} of ${day.habitsTotal} habits`}
            >
              <span className="text-xs text-muted-foreground">
                {day.dayLabel}
              </span>
              <div
                className={`size-8 rounded-md flex items-center justify-center text-xs font-medium ${
                  day.workoutCompleted
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {habitsPercent > 0 ? `${habitsPercent}%` : "\u2014"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
