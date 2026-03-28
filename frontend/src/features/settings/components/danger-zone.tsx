"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";

type DangerZoneProps = {
  onDeleteAccount?: () => void;
  isDeleting?: boolean;
};

export function DangerZone({ onDeleteAccount, isDeleting }: DangerZoneProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="rounded-lg border border-destructive/50 p-6 space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
      </div>

      <Button
        variant="destructive"
        onClick={() => setConfirmOpen(true)}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete Account"}
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Account"
        description="Are you sure you want to delete your account? All your data will be permanently removed. This action cannot be undone."
        confirmLabel="Delete Account"
        variant="destructive"
        onConfirm={() => onDeleteAccount?.()}
      />
    </div>
  );
}
