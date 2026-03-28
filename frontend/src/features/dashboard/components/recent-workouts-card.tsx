"use client";

import type { DashboardSummary } from "../hooks/use-dashboard-summary";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type RecentWorkoutsCardProps = {
  recentWorkouts: DashboardSummary["recentWorkouts"] | undefined;
  isLoading: boolean;
};

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function RecentWorkoutsCard({ recentWorkouts, isLoading }: RecentWorkoutsCardProps) {
  if (isLoading) {
    return (
      <Card className="glass card-depth-2 rounded-2xl border-border/30 animate-slide-up" style={{ animationDelay: "150ms" }}>
        <CardHeader>
          <CardTitle className="font-mono text-xs uppercase tracking-widest text-primary/60">Recent Workouts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!recentWorkouts || recentWorkouts.length === 0) {
    return (
      <Card className="glass card-depth-2 rounded-2xl border-border/30 animate-slide-up" style={{ animationDelay: "150ms" }}>
        <CardHeader>
          <CardTitle className="font-mono text-xs uppercase tracking-widest text-primary/60">Recent Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground/80">
            No workouts logged yet. Start your first workout!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass card-depth-2 rounded-2xl border-border/30 animate-slide-up" style={{ animationDelay: "150ms" }}>
      <CardHeader>
        <CardTitle className="font-mono text-xs uppercase tracking-widest text-primary/60">Recent Workouts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentWorkouts.map((w) => (
            <div
              key={w.id}
              className="flex items-center justify-between rounded-xl glass px-4 py-3 transition-colors hover:bg-primary/5"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{w.name}</p>
                <p className="text-xs text-muted-foreground/80">
                  {formatRelativeDate(w.completedAt)}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                <span className="font-mono">{w.totalSets} sets</span>
                <span className="font-mono font-bold text-foreground">
                  {w.totalVolume.toLocaleString()}kg
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
