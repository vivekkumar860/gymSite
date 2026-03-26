"use client";

import { PageHeader } from "@/shared/components/page-header";
import { DashboardGrid } from "../components/dashboard-grid";

export function DashboardView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Your fitness overview at a glance."
      />
      <DashboardGrid />
    </div>
  );
}
