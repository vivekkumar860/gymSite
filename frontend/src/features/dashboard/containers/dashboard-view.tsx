"use client";

import { PageHeader } from "@/shared/components/page-header";
import { DashboardGrid } from "../components/dashboard-grid";
import { DashboardHeroStats } from "../components/dashboard-hero-stats";
import { RecentWorkoutsCard } from "../components/recent-workouts-card";
import { useDashboardSummary } from "../hooks/use-dashboard-summary";

export function DashboardView() {
  const { data: summary, isLoading } = useDashboardSummary();

  return (
    <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
      <DashboardHeroStats summary={summary} isLoading={isLoading} />
      <DashboardGrid />
      <RecentWorkoutsCard
        recentWorkouts={summary?.recentWorkouts}
        isLoading={isLoading}
      />
    </div>
  );
}
