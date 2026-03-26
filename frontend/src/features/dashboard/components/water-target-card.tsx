"use client";

import { Button } from "@/components/ui/button";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import type { WaterTargetResponse } from "@/api/schemas/dashboard.schema";
import { WATER_LOG_INCREMENT_ML } from "../constants/dashboard-constants";

type WaterTargetCardProps = WaterTargetResponse & {
  onLogWater: (amountMl: number) => void;
  isLogging: boolean;
};

export function WaterTargetCard({
  currentMl,
  targetMl,
  onLogWater,
  isLogging,
}: WaterTargetCardProps) {
  const percentage =
    targetMl > 0 ? Math.min(Math.round((currentMl / targetMl) * 100), 100) : 0;

  const glasses = Math.floor(currentMl / WATER_LOG_INCREMENT_ML);
  const targetGlasses = Math.ceil(targetMl / WATER_LOG_INCREMENT_ML);

  return (
    <div className="space-y-3">
      <Progress value={percentage} max={100}>
        <ProgressLabel>Water</ProgressLabel>
        <ProgressValue>
          {() => `${currentMl} / ${targetMl} ml`}
        </ProgressValue>
      </Progress>

      <p className="text-xs text-muted-foreground">
        {glasses} of {targetGlasses} glasses ({WATER_LOG_INCREMENT_ML}ml each)
      </p>

      <Button
        size="sm"
        variant="outline"
        onClick={() => onLogWater(WATER_LOG_INCREMENT_ML)}
        disabled={isLogging || currentMl >= targetMl}
        aria-label={`Log ${WATER_LOG_INCREMENT_ML}ml of water`}
      >
        + {WATER_LOG_INCREMENT_ML}ml
      </Button>
    </div>
  );
}
