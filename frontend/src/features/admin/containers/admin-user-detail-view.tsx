"use client";

import { useAdminUserDetail } from "../hooks/use-admin-users";
import { useSuspendUser, useRestoreUser, useUpdateUserRole } from "../hooks/use-admin-mutations";
import { PageHeader } from "@/shared/components/page-header";
import { LoadingSkeleton } from "@/shared/components/loading-skeleton";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/shared/components/stat-card";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { Dumbbell, Target, CheckSquare } from "lucide-react";
import { useState } from "react";

type AdminUserDetailViewProps = {
  userId: string;
};

export function AdminUserDetailView({ userId }: AdminUserDetailViewProps) {
  const { data: user, isLoading, error } = useAdminUserDetail(userId);
  const suspendUser = useSuspendUser();
  const restoreUser = useRestoreUser();
  const updateUserRole = useUpdateUserRole();
  const [confirmAction, setConfirmAction] = useState<"suspend" | "restore" | null>(null);

  if (isLoading) return <LoadingSkeleton variant="card" count={3} />;
  if (error || !user) return <ErrorBoundaryCard message="Failed to load user." />;

  const handleConfirm = () => {
    if (confirmAction === "suspend") suspendUser.mutate(userId);
    else if (confirmAction === "restore") restoreUser.mutate(userId);
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={user.username}
        description={user.email}
      >
        {user.accountStatus === "ACTIVE" && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmAction("suspend")}
          >
            Suspend
          </Button>
        )}
        {user.accountStatus === "SUSPENDED" && (
          <Button
            size="sm"
            onClick={() => setConfirmAction("restore")}
          >
            Restore
          </Button>
        )}
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">User Info</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Role</p>
                <Badge
                  variant={user.role === "ADMIN" ? "default" : "secondary"}
                >
                  {user.role}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge
                  variant={
                    user.accountStatus === "ACTIVE"
                      ? "default"
                      : "destructive"
                  }
                >
                  {user.accountStatus}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Joined</p>
                <p>{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p>{new Date(user.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            {user.profile && (
              <>
                <h3 className="pt-4 text-lg font-semibold">Profile</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p>
                      {user.profile.firstName || user.profile.lastName
                        ? `${user.profile.firstName ?? ""} ${user.profile.lastName ?? ""}`.trim()
                        : "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fitness Level</p>
                    <p>{user.profile.fitnessLevel}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Dietary Preference</p>
                    <p>{user.profile.dietaryPreference.replace(/_/g, " ")}</p>
                  </div>
                </div>
              </>
            )}

            <h3 className="pt-4 text-lg font-semibold">Change Role</h3>
            <div className="flex gap-2">
              {(["MEMBER", "TRAINER", "ADMIN"] as const).map((role) => (
                <Button
                  key={role}
                  variant={user.role === role ? "default" : "outline"}
                  size="sm"
                  disabled={user.role === role}
                  onClick={() => updateUserRole.mutate({ userId, role })}
                >
                  {role}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <StatCard
            label="Workout Sessions"
            value={user.stats.totalWorkoutSessions}
            icon={Dumbbell}
          />
          <StatCard
            label="Goals"
            value={user.stats.totalGoals}
            icon={Target}
          />
          <StatCard
            label="Habits"
            value={user.stats.totalHabits}
            icon={CheckSquare}
          />
        </div>
      </div>

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={confirmAction === "suspend" ? "Suspend User" : "Restore User"}
        description={
          confirmAction === "suspend"
            ? `Are you sure you want to suspend ${user.username}?`
            : `Are you sure you want to restore ${user.username}?`
        }
        confirmLabel={confirmAction === "suspend" ? "Suspend" : "Restore"}
        variant={confirmAction === "suspend" ? "destructive" : "default"}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
