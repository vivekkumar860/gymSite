"use client";

import type { GoalResponse } from "@/api/services/goals.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type GoalCardProps = {
  goal: GoalResponse;
};

export function GoalCard({ goal }: GoalCardProps) {
  const progressPercent = Math.min(Math.round(goal.progressPct), 100);

  const statusVariant =
    goal.goalStatus === "COMPLETED"
      ? "default"
      : goal.goalStatus === "ABANDONED"
        ? "destructive"
        : "secondary";

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="space-y-1">
          <CardTitle className="text-base">{goal.title}</CardTitle>
          {goal.description && (
            <p className="text-sm text-muted-foreground">{goal.description}</p>
          )}
        </div>
        <Badge variant={statusVariant}>{goal.goalStatus}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {goal.currentValue ?? 0} / {goal.targetValue ?? 0}
              {goal.targetUnit ? ` ${goal.targetUnit}` : ""}
            </span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} />
        </div>
        {goal.deadline && (
          <p className="text-xs text-muted-foreground">
            Deadline: {goal.deadline}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
