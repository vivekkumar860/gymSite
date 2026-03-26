"use client";

import type { HabitWithStreak, HabitLog } from "@/api/schemas/habits.schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type HabitCardProps = {
  habit: HabitWithStreak;
  todayLog?: HabitLog;
  onToggle?: () => void;
};

export function HabitCard({ habit, todayLog, onToggle }: HabitCardProps) {
  const isCompletedToday = todayLog?.completed ?? false;
  const completionPercent = Math.round(habit.completionRate * 100);

  return (
    <Card
      className={cn(
        "transition-colors",
        isCompletedToday && "ring-2 ring-primary/30",
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {habit.icon && <span>{habit.icon}</span>}
          <span className="truncate">{habit.name}</span>
        </CardTitle>
        <CardAction>
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              "flex size-7 items-center justify-center rounded-md border-2 transition-colors",
              isCompletedToday
                ? "border-primary bg-primary text-primary-foreground"
                : "border-muted-foreground/30 hover:border-primary/50",
            )}
            aria-label={
              isCompletedToday ? "Mark as incomplete" : "Mark as complete"
            }
          >
            {isCompletedToday && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        {habit.currentStreak > 0 && (
          <Badge variant="secondary" className="gap-1">
            <span aria-hidden="true" role="img">
              🔥
            </span>
            {habit.currentStreak} streak
          </Badge>
        )}
        <Badge variant="outline">{completionPercent}%</Badge>
        <Badge variant="outline" className="capitalize">
          {habit.frequency}
        </Badge>
      </CardContent>
    </Card>
  );
}
