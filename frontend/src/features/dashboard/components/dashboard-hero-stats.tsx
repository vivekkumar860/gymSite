"use client";

import type { DashboardSummary } from "../hooks/use-dashboard-summary";
import { Skeleton } from "@/components/ui/skeleton";

type DashboardHeroStatsProps = {
  summary: DashboardSummary | undefined;
  isLoading: boolean;
};

type StatChip = { label: string; value: string };

export function DashboardHeroStats({ summary, isLoading }: DashboardHeroStatsProps) {
  if (isLoading) {
    return (
      <div className="glass card-depth-3 rounded-2xl p-6 md:p-8 animate-slide-up">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-xl border-glow p-3 text-center space-y-1.5 min-w-[120px]">
                <Skeleton className="h-3 w-16 mx-auto" />
                <Skeleton className="h-6 w-12 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const greeting = getGreeting();
  const chips: StatChip[] = [
    { label: "This Week", value: `${summary.weeklyWorkoutCount} workouts` },
    {
      label: "Calorie Target",
      value: summary.todayCalorieTarget
        ? `${summary.todayCalorieTarget.toLocaleString()} kcal`
        : "No plan",
    },
    { label: "Active Goals", value: String(summary.activeGoalsCount) },
    {
      label: "Habits Today",
      value: `${summary.habitsCompletedToday}/${summary.totalHabits}`,
    },
  ];

  return (
    <div
      className="relative overflow-hidden glass card-depth-3 rounded-2xl p-6 md:p-8 animate-slide-up"
      style={{
        backgroundImage:
          "linear-gradient(135deg, color-mix(in oklch, var(--glow) 10%, transparent) 0%, transparent 40%, color-mix(in oklch, var(--glow-secondary) 5%, transparent) 100%), repeating-linear-gradient(0deg, transparent, transparent 30px, color-mix(in oklch, var(--border) 4%, transparent) 30px, color-mix(in oklch, var(--border) 4%, transparent) 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, color-mix(in oklch, var(--border) 4%, transparent) 30px, color-mix(in oklch, var(--border) 4%, transparent) 31px)",
      }}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left: Greeting */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter gradient-text">
            {greeting}
          </h1>
          <p className="text-sm text-muted-foreground/80">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Right: Stat pills */}
        <div className="grid grid-cols-2 gap-3">
          {chips.map((chip) => (
            <div
              key={chip.label}
              className="glass rounded-xl border-glow p-3 text-center space-y-0.5 min-w-[120px]"
            >
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-primary/60">
                {chip.label}
              </p>
              <p className="text-base font-black tabular-nums">{chip.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
