"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminUserFilterState } from "../types/admin.types";

type AdminUserFiltersProps = {
  filters: AdminUserFilterState;
  onFiltersChange: (filters: AdminUserFilterState) => void;
};

export function AdminUserFilters({
  filters,
  onFiltersChange,
}: AdminUserFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Input
        placeholder="Search users..."
        value={filters.search}
        onChange={(e) =>
          onFiltersChange({ ...filters, search: e.target.value })
        }
        className="sm:max-w-xs"
      />

      <Select
        value={filters.role}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, role: value ?? "all" })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All roles</SelectItem>
          <SelectItem value="MEMBER">Member</SelectItem>
          <SelectItem value="TRAINER">Trainer</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.accountStatus}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, accountStatus: value ?? "all" })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="SUSPENDED">Suspended</SelectItem>
          <SelectItem value="DEACTIVATED">Deactivated</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
