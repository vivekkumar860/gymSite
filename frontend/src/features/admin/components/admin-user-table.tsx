"use client";

import Link from "next/link";
import type { AdminUserListItem } from "@/api/services/admin.service";
import { DataTable } from "@/shared/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/config/routes";

type AdminUserTableProps = {
  users: AdminUserListItem[];
  isLoading?: boolean;
  onSuspend: (userId: string) => void;
  onRestore: (userId: string) => void;
  onRoleChange: (userId: string, role: string) => void;
};

export function AdminUserTable({
  users,
  isLoading,
  onSuspend,
  onRestore,
  onRoleChange,
}: AdminUserTableProps) {
  const columns = [
    {
      key: "username",
      header: "Username",
      render: (row: AdminUserListItem) => (
        <Link
          href={ROUTES.admin.userDetail(row.id)}
          className="font-medium text-primary hover:underline"
        >
          {row.username}
        </Link>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (row: AdminUserListItem) => row.email,
    },
    {
      key: "role",
      header: "Role",
      render: (row: AdminUserListItem) => (
        <Badge
          variant={
            row.role === "ADMIN"
              ? "default"
              : row.role === "TRAINER"
                ? "secondary"
                : "outline"
          }
        >
          {row.role}
        </Badge>
      ),
    },
    {
      key: "accountStatus",
      header: "Status",
      render: (row: AdminUserListItem) => (
        <Badge
          variant={
            row.accountStatus === "ACTIVE"
              ? "default"
              : row.accountStatus === "SUSPENDED"
                ? "destructive"
                : "outline"
          }
        >
          {row.accountStatus}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
      render: (row: AdminUserListItem) =>
        new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: AdminUserListItem) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
            ...
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              render={<Link href={ROUTES.admin.userDetail(row.id)} />}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {row.accountStatus === "ACTIVE" ? (
              <DropdownMenuItem
                onClick={() => onSuspend(row.id)}
                variant="destructive"
              >
                Suspend
              </DropdownMenuItem>
            ) : row.accountStatus === "SUSPENDED" ? (
              <DropdownMenuItem onClick={() => onRestore(row.id)}>
                Restore
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuSeparator />
            {row.role !== "ADMIN" && (
              <DropdownMenuItem onClick={() => onRoleChange(row.id, "ADMIN")}>
                Make Admin
              </DropdownMenuItem>
            )}
            {row.role !== "TRAINER" && (
              <DropdownMenuItem onClick={() => onRoleChange(row.id, "TRAINER")}>
                Make Trainer
              </DropdownMenuItem>
            )}
            {row.role !== "MEMBER" && (
              <DropdownMenuItem onClick={() => onRoleChange(row.id, "MEMBER")}>
                Make Member
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable<AdminUserListItem & Record<string, unknown>>
      columns={
        columns as Parameters<
          typeof DataTable<AdminUserListItem & Record<string, unknown>>
        >[0]["columns"]
      }
      data={users as (AdminUserListItem & Record<string, unknown>)[]}
      isLoading={isLoading}
      emptyMessage="No users found"
    />
  );
}
