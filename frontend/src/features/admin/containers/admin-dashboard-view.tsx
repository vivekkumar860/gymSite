"use client";

import { useAdminStats } from "../hooks/use-admin-stats";
import { AdminStatsGrid } from "../components/admin-stats-grid";
import { PageHeader } from "@/shared/components/page-header";
import { LoadingSkeleton } from "@/shared/components/loading-skeleton";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";

export function AdminDashboardView() {
  const { stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return <LoadingSkeleton variant="card" count={4} />;
  }

  if (error || !stats) {
    return <ErrorBoundaryCard message="Failed to load admin stats." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Overview of platform metrics."
      />
      <AdminStatsGrid stats={stats} />
    </div>
  );
}
