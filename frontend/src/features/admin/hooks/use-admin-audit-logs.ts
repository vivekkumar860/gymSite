"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as adminService from "@/api/services/admin.service";

export type AuditLogFilters = {
  page?: number;
  limit?: number;
  actionType?: string;
  targetTable?: string;
};

export function useAdminAuditLogs(filters: AuditLogFilters = {}) {
  return useQuery({
    queryKey: queryKeys.admin.auditLogs(filters),
    queryFn: () => adminService.getAuditLogs(filters),
  });
}
