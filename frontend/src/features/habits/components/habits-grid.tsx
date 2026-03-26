"use client";

import type { HabitWithStreak, HabitLog } from "@/api/schemas/habits.schema";
import { HabitCard } from "./habit-card";

type HabitsGridProps = {
  habits: HabitWithStreak[];
  todayLogs: HabitLog[];
  onToggleHabit?: (habitId: string) => void;
};

export function HabitsGrid({
  habits,
  todayLogs,
  onToggleHabit,
}: HabitsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {habits.map((habit) => {
        const todayLog = todayLogs.find((log) => log.habitId === habit.id);
        return (
          <HabitCard
            key={habit.id}
            habit={habit}
            todayLog={todayLog}
            onToggle={
              onToggleHabit ? () => onToggleHabit(habit.id) : undefined
            }
          />
        );
      })}
    </div>
  );
}
