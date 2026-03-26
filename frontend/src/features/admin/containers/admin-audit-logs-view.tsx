"use client";

import { useState } from "react";
import { useAdminAuditLogs } from "../hooks/use-admin-audit-logs";
import { PageHeader } from "@/shared/components/page-header";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";
import { DataTable } from "@/shared/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_PAGE_SIZE } from "@/config/constants";
import type { AuditLog } from "@/api/services/admin.service";

const ACTION_TYPES = [
  "CREATE",
  "UPDATE",
  "DELETE",
  "SUSPEND_USER",
  "RESTORE_USER",
] as const;

export function AdminAuditLogsView() {
  const [page, setPage] = useState(1);
  const [actionType, setActionType] = useState("all");

  const { data, isLoading, error } = useAdminAuditLogs({
    page,
    limit: DEFAULT_PAGE_SIZE,
    actionType: actionType === "all" ? undefined : actionType,
  });

  if (error) {
    return <ErrorBoundaryCard message="Failed to load audit logs." />;
  }

  const logs = data?.data ?? [];
  const meta = data?.meta;

  const columns = [
    {
      key: "createdAt",
      header: "Time",
      render: (row: AuditLog) =>
        new Date(row.createdAt).toLocaleString(),
    },
    {
      key: "adminUsername",
      header: "Admin",
      render: (row: AuditLog) => (
        <span className="font-medium">{row.adminUsername}</span>
      ),
    },
    {
      key: "actionType",
      header: "Action",
      render: (row: AuditLog) => (
        <Badge
          variant={
            row.actionType === "DELETE" || row.actionType === "SUSPEND_USER"
              ? "destructive"
              : row.actionType === "CREATE"
                ? "default"
                : "secondary"
          }
        >
          {row.actionType.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      key: "targetTable",
      header: "Target",
      render: (row: AuditLog) => row.targetTable,
    },
    {
      key: "changeSummary",
      header: "Changes",
      render: (row: AuditLog) => {
        if (!row.changeSummary) return "-";
        const summary = row.changeSummary as Record<string, unknown>;
        const parts: string[] = [];
        if (summary.before && summary.after) {
          const after = summary.after as Record<string, unknown>;
          for (const [key, value] of Object.entries(after)) {
            parts.push(`${key}: ${String(value)}`);
          }
        }
        return parts.length > 0 ? (
          <span className="text-xs text-muted-foreground">
            {parts.join(", ")}
          </span>
        ) : (
          "-"
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Track all admin actions on the platform."
      />

      <div className="flex gap-3">
        <Select value={actionType} onValueChange={(value) => setActionType(value ?? "all")}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            {ACTION_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable<AuditLog & Record<string, unknown>>
        columns={
          columns as Parameters<
            typeof DataTable<AuditLog & Record<string, unknown>>
          >[0]["columns"]
        }
        data={logs as (AuditLog & Record<string, unknown>)[]}
        isLoading={isLoading}
        emptyMessage="No audit logs found"
      />

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= meta.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
