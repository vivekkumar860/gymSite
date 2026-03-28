"use client";

type WeeklyVolumeData = {
  weekStart: string;
  totalVolume: number;
  workoutCount: number;
};

type WeeklyVolumeChartProps = {
  data: WeeklyVolumeData[];
  height?: number;
};

function formatWeekLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function WeeklyVolumeChart({ data, height = 200 }: WeeklyVolumeChartProps) {
  const maxVolume = Math.max(...data.map((d) => d.totalVolume), 1);
  const barCount = data.length;
  if (barCount === 0) return null;

  const padding = { top: 10, right: 10, bottom: 30, left: 10 };
  const chartWidth = 600;
  const chartHeight = height;
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;
  const barWidth = innerWidth / barCount * 0.7;
  const barGap = innerWidth / barCount * 0.3;

  const allZero = data.every((d) => d.totalVolume === 0);
  if (allZero) {
    return (
      <div className="flex items-center justify-center rounded-xl glass p-8" style={{ height }}>
        <p className="text-sm text-muted-foreground/80">Start logging workouts to see your volume trend</p>
      </div>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      preserveAspectRatio="xMidYMid meet"
      className="w-full"
      style={{ maxHeight: height }}
    >
      {data.map((week, i) => {
        const barHeight = Math.max((week.totalVolume / maxVolume) * innerHeight, 4);
        const x = padding.left + i * (barWidth + barGap) + barGap / 2;
        const y = padding.top + innerHeight - barHeight;

        return (
          <g key={week.weekStart}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={4}
              className="fill-primary/60 hover:fill-primary transition-all duration-200"
              style={{ filter: "none" }}
            >
              <title>{`${week.totalVolume.toLocaleString()}kg · ${week.workoutCount} sessions`}</title>
            </rect>
            <text
              x={x + barWidth / 2}
              y={chartHeight - 8}
              textAnchor="middle"
              className="fill-muted-foreground"
              style={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
            >
              {formatWeekLabel(week.weekStart)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
