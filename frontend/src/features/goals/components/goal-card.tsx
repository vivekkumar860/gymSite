"use client";

import { useState } from "react";
import type { GoalResponse } from "@/api/services/goals.service";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { CheckCircle2Icon, TrophyIcon, TrashIcon } from "lucide-react";

type GoalCardProps = {
  goal: GoalResponse;
  onUpdateProgress?: (id: string, currentValue: number) => void;
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  isUpdating?: boolean;
};

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  ACTIVE: { label: "Active", variant: "secondary" },
  COMPLETED: { label: "Completed", variant: "default" },
  ABANDONED: { label: "Abandoned", variant: "destructive" },
};

export function GoalCard({ goal, onUpdateProgress, onComplete, onDelete, isUpdating }: GoalCardProps) {
  const [editValue, setEditValue] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [confirmComplete, setConfirmComplete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const progressPercent = Math.min(Math.round(goal.progressPct), 100);
  const isCompleted = goal.goalStatus === "COMPLETED";
  const statusConf = STATUS_CONFIG[goal.goalStatus] ?? STATUS_CONFIG.ACTIVE;

  function handleSaveProgress() {
    const value = parseFloat(editValue);
    if (isNaN(value) || !onUpdateProgress) return;
    onUpdateProgress(goal.id, value);
    setIsEditing(false);
    setEditValue("");
  }

  return (
    <Card
      className={`glass card-depth-2 rounded-2xl border-l-4 interactive ${
        isCompleted
          ? "border-l-green-500"
          : "border-l-primary"
      }`}
      style={{
        boxShadow: isCompleted
          ? "-4px 0 12px oklch(0.7 0.2 145 / 0.3)"
          : "-4px 0 12px color-mix(in oklch, var(--glow) 20%, transparent)",
      }}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <CardTitle className="text-base font-bold truncate">{goal.title}</CardTitle>
          {goal.description && (
            <p className="text-sm text-muted-foreground/80 line-clamp-2">{goal.description}</p>
          )}
        </div>
        <Badge variant={statusConf.variant}>{statusConf.label}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {goal.currentValue ?? 0} / {goal.targetValue ?? 0}
              {goal.targetUnit ? ` ${goal.targetUnit}` : ""}
            </span>
            <span className="font-mono font-bold">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent}>
            <ProgressTrack className="bg-muted/50">
              <ProgressIndicator className={`${isCompleted ? "bg-green-500" : "bg-gradient-to-r from-primary to-primary/60"} rounded-full`} />
            </ProgressTrack>
          </Progress>
        </div>

        {/* Deadline */}
        {goal.deadline && (
          <p className="font-mono text-xs text-muted-foreground/80">
            Deadline: {new Date(goal.deadline).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
          </p>
        )}

        {/* Inline progress edit */}
        {isEditing && onUpdateProgress && (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              step="0.1"
              placeholder="New value"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-8 w-28 font-mono"
            />
            <Button size="sm" onClick={handleSaveProgress} disabled={isUpdating} className="glow-sm">
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        )}
      </CardContent>

      {/* Actions for active goals */}
      {goal.goalStatus === "ACTIVE" && (onUpdateProgress || onComplete) && (
        <CardFooter className="flex gap-2">
          {onUpdateProgress && !isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditValue(String(goal.currentValue ?? 0));
                setIsEditing(true);
              }}
              className="hover:border-primary/40 hover:bg-primary/5"
            >
              Update Progress
            </Button>
          )}
          {onComplete && (
            <Button variant="ghost" size="sm" onClick={() => setConfirmComplete(true)} className="hover:bg-green-500/10 hover:text-green-600">
              <CheckCircle2Icon className="mr-1.5 size-3.5" />
              Mark Complete
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(true)} className="ml-auto text-destructive/70 hover:text-destructive hover:bg-destructive/10">
              <TrashIcon className="size-3.5" />
              <span className="sr-only">Delete goal</span>
            </Button>
          )}
        </CardFooter>
      )}

      {/* Completed state */}
      {isCompleted && (
        <CardFooter>
          <div className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
            <TrophyIcon className="size-4" />
            Goal achieved
          </div>
        </CardFooter>
      )}

      {onComplete && (
        <ConfirmDialog
          open={confirmComplete}
          onOpenChange={setConfirmComplete}
          title="Complete this goal?"
          description={`Mark "${goal.title}" as completed. This cannot be undone.`}
          confirmLabel="Complete"
          onConfirm={() => onComplete(goal.id)}
        />
      )}

      {onDelete && (
        <ConfirmDialog
          open={confirmDelete}
          onOpenChange={setConfirmDelete}
          title="Delete this goal?"
          description={`Permanently delete "${goal.title}" and all its milestones. This cannot be undone.`}
          confirmLabel="Delete Goal"
          variant="destructive"
          onConfirm={() => onDelete(goal.id)}
        />
      )}
    </Card>
  );
}
