"use client";

import { useState, useEffect } from "react";
import type { HabitWithStreak, HabitLog } from "@/api/schemas/habits.schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { PencilIcon, TrashIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type HabitCardProps = {
  habit: HabitWithStreak;
  todayLog?: HabitLog;
  onToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  colorIndex?: number;
};

const BORDER_COLORS = [
  "border-l-blue-500",
  "border-l-amber-500",
  "border-l-rose-500",
  "border-l-emerald-500",
  "border-l-violet-500",
  "border-l-pink-500",
] as const;

const GRID_FILL_COLORS = [
  "bg-blue-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-pink-500",
] as const;

export function HabitCard({ habit, todayLog, onToggle, onEdit, onDelete, colorIndex = 0 }: HabitCardProps) {
  const isCompletedToday = todayLog?.completed ?? false;
  const [justCompleted, setJustCompleted] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const borderColor = habit.color
    ? undefined
    : BORDER_COLORS[colorIndex % BORDER_COLORS.length];
  const gridColor = GRID_FILL_COLORS[colorIndex % GRID_FILL_COLORS.length];

  useEffect(() => {
    if (isCompletedToday) {
      setJustCompleted(true);
      const t = setTimeout(() => setJustCompleted(false), 500);
      return () => clearTimeout(t);
    }
  }, [isCompletedToday]);

  const filledSquares = Math.min(habit.currentStreak, 28);
  const gridSquares = Array.from({ length: 28 }, (_, i) => i < filledSquares);

  return (
    <div
      className={cn(
        "glass card-depth-2 rounded-2xl border-l-4 overflow-hidden interactive",
        borderColor,
        justCompleted && "animate-habit-complete",
      )}
      style={habit.color ? { borderLeftColor: habit.color } : undefined}
    >
      <div className="p-4 space-y-3">
        {/* Top row: icon + name + actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {habit.icon && <span className="text-2xl">{habit.icon}</span>}
            <span className="font-semibold truncate">{habit.name}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {habit.currentStreak > 0 && (
              <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-primary/20">
                <span aria-hidden="true">🔥</span>
                {habit.currentStreak}
              </Badge>
            )}
            {onEdit && (
              <Button variant="ghost" size="icon" className="size-7" onClick={onEdit}>
                <PencilIcon className="size-3.5" />
                <span className="sr-only">Edit habit</span>
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" className="size-7 text-destructive/70 hover:text-destructive" onClick={() => setConfirmDeleteOpen(true)}>
                <TrashIcon className="size-3.5" />
                <span className="sr-only">Delete habit</span>
              </Button>
            )}
          </div>
        </div>

        {/* 28-day completion grid (7x4) */}
        <div className="grid grid-cols-7 gap-0.5">
          {gridSquares.map((filled, i) => (
            <div
              key={i}
              className={cn(
                "size-2.5 rounded-sm transition-colors",
                filled ? gridColor : "bg-muted/50"
              )}
            />
          ))}
        </div>

        {/* Badges row */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs capitalize">
            {habit.frequency}
          </Badge>
        </div>

        {/* Completion button */}
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              "w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95",
              isCompletedToday
                ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                : "border border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50"
            )}
          >
            {isCompletedToday ? (
              <span className="flex items-center justify-center gap-1.5 animate-scale-in">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="size-4">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Done!
              </span>
            ) : (
              "Mark Done"
            )}
          </button>
        )}
      </div>

      {onDelete && (
        <ConfirmDialog
          open={confirmDeleteOpen}
          onOpenChange={setConfirmDeleteOpen}
          title={`Delete "${habit.name}"?`}
          description="This will permanently delete this habit and all completion history. This action cannot be undone."
          confirmLabel="Delete Habit"
          variant="destructive"
          onConfirm={() => onDelete()}
        />
      )}
    </div>
  );
}
