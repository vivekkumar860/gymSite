"use client";

import { useState } from "react";
import { useAdminUsers } from "../hooks/use-admin-users";
import { useSuspendUser, useRestoreUser, useUpdateUserRole } from "../hooks/use-admin-mutations";
import { AdminUserTable } from "../components/admin-user-table";
import { AdminUserFilters } from "../components/admin-user-filters";
import { PageHeader } from "@/shared/components/page-header";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { useDebounce } from "@/shared/hooks";
import { DEFAULT_PAGE_SIZE } from "@/config/constants";
import type { AdminUserFilterState } from "../types/admin.types";

export function AdminUsersView() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AdminUserFilterState>({
    search: "",
    role: "all",
    accountStatus: "all",
  });
  const [confirmAction, setConfirmAction] = useState<{
    type: "suspend" | "restore";
    userId: string;
  } | null>(null);

  const debouncedSearch = useDebounce(filters.search, 300);

  const { data, isLoading, error } = useAdminUsers({
    page,
    limit: DEFAULT_PAGE_SIZE,
    search: debouncedSearch || undefined,
    role: filters.role === "all" ? undefined : filters.role,
    accountStatus: filters.accountStatus === "all" ? undefined : filters.accountStatus,
  });

  const suspendUser = useSuspendUser();
  const restoreUser = useRestoreUser();
  const updateUserRole = useUpdateUserRole();

  const handleFiltersChange = (newFilters: AdminUserFilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;
    if (confirmAction.type === "suspend") {
      suspendUser.mutate(confirmAction.userId);
    } else {
      restoreUser.mutate(confirmAction.userId);
    }
    setConfirmAction(null);
  };

  if (error) {
    return <ErrorBoundaryCard message="Failed to load users." />;
  }

  const users = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="View and manage platform users."
      />

      <AdminUserFilters filters={filters} onFiltersChange={handleFiltersChange} />

      <AdminUserTable
        users={users}
        isLoading={isLoading}
        onSuspend={(userId) =>
          setConfirmAction({ type: "suspend", userId })
        }
        onRestore={(userId) =>
          setConfirmAction({ type: "restore", userId })
        }
        onRoleChange={(userId, role) =>
          updateUserRole.mutate({ userId, role })
        }
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

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={
          confirmAction?.type === "suspend"
            ? "Suspend User"
            : "Restore User"
        }
        description={
          confirmAction?.type === "suspend"
            ? "Are you sure you want to suspend this user? They will lose access to the platform."
            : "Are you sure you want to restore this user? They will regain access to the platform."
        }
        confirmLabel={confirmAction?.type === "suspend" ? "Suspend" : "Restore"}
        variant={confirmAction?.type === "suspend" ? "destructive" : "default"}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
