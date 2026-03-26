"use client";

import type { WeightTrendResponse } from "@/api/schemas/dashboard.schema";

type WeightTrendCardProps = WeightTrendResponse;

export function WeightTrendCard({
  entries,
  currentWeight,
  changeFromLast,
  unit,
}: WeightTrendCardProps) {
  if (currentWeight == null) {
    return (
      <p className="text-sm text-muted-foreground">No weight data recorded.</p>
    );
  }

  const maxWeight = Math.max(...entries.map((e) => e.weight));
  const minWeight = Math.min(...entries.map((e) => e.weight));
  const range = maxWeight - minWeight || 1;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tabular-nums">
          {currentWeight.toFixed(1)}
        </span>
        <span className="text-sm text-muted-foreground">{unit}</span>

        {changeFromLast != null && changeFromLast !== 0 && (
          <span
            className={`text-sm font-medium ${
              changeFromLast < 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {changeFromLast > 0 ? "+" : ""}
            {changeFromLast.toFixed(1)} {unit}
          </span>
        )}
      </div>

      {entries.length > 1 && (
        <div
          className="flex h-16 items-end gap-px"
          role="img"
          aria-label={`Weight trend chart showing ${entries.length} data points from ${entries[0].date} to ${entries[entries.length - 1].date}`}
        >
          {entries.map((entry) => {
            const heightPercent =
              ((entry.weight - minWeight) / range) * 80 + 20;
            return (
              <div
                key={entry.date}
                className="flex-1 rounded-t bg-primary/60 transition-all hover:bg-primary"
                style={{ height: `${heightPercent}%` }}
                title={`${entry.date}: ${entry.weight} ${unit}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
