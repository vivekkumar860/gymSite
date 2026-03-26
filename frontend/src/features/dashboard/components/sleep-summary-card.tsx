"use client";

import { Badge } from "@/components/ui/badge";
import type { SleepSummaryResponse } from "@/api/schemas/dashboard.schema";

type SleepSummaryCardProps = SleepSummaryResponse;

const QUALITY_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  poor: "destructive",
  fair: "outline",
  good: "secondary",
  excellent: "default",
};

export function SleepSummaryCard({
  hoursSlept,
  targetHours,
  quality,
  bedtime,
  wakeTime,
}: SleepSummaryCardProps) {
  const deficit = targetHours - hoursSlept;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold tabular-nums">
          {hoursSlept.toFixed(1)}
          <span className="text-sm font-normal text-muted-foreground">
            {" "}
            / {targetHours}h
          </span>
        </span>
        <Badge variant={QUALITY_VARIANTS[quality] ?? "outline"}>
          {quality}
        </Badge>
      </div>

      {(bedtime || wakeTime) && (
        <div className="flex gap-4 text-sm text-muted-foreground">
          {bedtime && <span>Bed: {bedtime}</span>}
          {wakeTime && <span>Wake: {wakeTime}</span>}
        </div>
      )}

      {deficit > 0 && (
        <p className="text-xs text-muted-foreground">
          {deficit.toFixed(1)}h below target
        </p>
      )}
    </div>
  );
}
