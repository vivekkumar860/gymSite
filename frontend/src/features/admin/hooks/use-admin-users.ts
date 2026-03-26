"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as adminService from "@/api/services/admin.service";

export type AdminUserFilters = {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  accountStatus?: string;
};

export function useAdminUsers(filters: AdminUserFilters = {}) {
  return useQuery({
    queryKey: queryKeys.admin.users(filters),
    queryFn: () => adminService.getUsers(filters),
  });
}

export function useAdminUserDetail(userId: string) {
  return useQuery({
    queryKey: queryKeys.admin.userDetail(userId),
    queryFn: () => adminService.getUserById(userId),
    enabled: !!userId,
  });
}
