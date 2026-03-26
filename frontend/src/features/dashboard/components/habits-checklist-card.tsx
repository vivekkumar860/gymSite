"use client";

import type { HabitChecklistItem } from "../types/dashboard.types";

type HabitsChecklistCardProps = {
  habits: HabitChecklistItem[];
  onToggle: (habitId: string, completed: boolean) => void;
  isToggling: boolean;
};

export function HabitsChecklistCard({
  habits,
  onToggle,
  isToggling,
}: HabitsChecklistCardProps) {
  const completedCount = habits.filter((h) => h.completedToday).length;

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        {completedCount} of {habits.length} completed
      </p>

      <ul className="space-y-2" role="list">
        {habits.map((habit) => (
          <li key={habit.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              id={`habit-${habit.id}`}
              checked={habit.completedToday}
              onChange={() => onToggle(habit.id, !habit.completedToday)}
              disabled={isToggling}
              className="size-4 rounded border-input accent-primary"
              aria-label={`Mark ${habit.name} as ${habit.completedToday ? "incomplete" : "complete"}`}
            />
            <label
              htmlFor={`habit-${habit.id}`}
              className={`text-sm ${
                habit.completedToday
                  ? "text-muted-foreground line-through"
                  : "text-foreground"
              }`}
            >
              {habit.name}
            </label>
            {habit.currentStreak > 0 && (
              <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                {habit.currentStreak}d streak
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
