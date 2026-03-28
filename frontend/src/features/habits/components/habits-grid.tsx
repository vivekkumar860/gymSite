"use client";

import type { HabitWithStreak, HabitLog } from "@/api/schemas/habits.schema";
import { HabitCard } from "./habit-card";

type HabitsGridProps = {
  habits: HabitWithStreak[];
  todayLogs: HabitLog[];
  onToggleHabit?: (habitId: string) => void;
  onEditHabit?: (habitId: string) => void;
  onDeleteHabit?: (habitId: string) => void;
};

export function HabitsGrid({
  habits,
  todayLogs,
  onToggleHabit,
  onEditHabit,
  onDeleteHabit,
}: HabitsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {habits.map((habit, idx) => {
        const todayLog = todayLogs.find((log) => log.habitId === habit.id);
        return (
          <div
            key={habit.id}
            className="animate-slide-up"
            style={{ animationDelay: `${Math.min(idx * 50, 200)}ms` }}
          >
            <HabitCard
              habit={habit}
              todayLog={todayLog}
              onToggle={
                onToggleHabit ? () => onToggleHabit(habit.id) : undefined
              }
              onEdit={
                onEditHabit ? () => onEditHabit(habit.id) : undefined
              }
              onDelete={
                onDeleteHabit ? () => onDeleteHabit(habit.id) : undefined
              }
              colorIndex={idx}
            />
          </div>
        );
      })}
    </div>
  );
}
