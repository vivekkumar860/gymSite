"use client";

import type { Macros } from "@/api/schemas/nutrition.schema";

type MacroTargetsCardProps = {
  targetMacros: Macros;
};

const PROTEIN_KCAL_PER_G = 4;
const CARBS_KCAL_PER_G = 4;
const FAT_KCAL_PER_G = 9;

type MacroSegment = {
  key: string;
  label: string;
  grams: number;
  kcal: number;
  pct: number;
  color: string;
  dotClass: string;
  barClass: string;
  textClass: string;
};

function buildSegments(macros: Macros): MacroSegment[] {
  const proteinKcal = macros.protein * PROTEIN_KCAL_PER_G;
  const carbsKcal = macros.carbs * CARBS_KCAL_PER_G;
  const fatKcal = macros.fat * FAT_KCAL_PER_G;
  const total = proteinKcal + carbsKcal + fatKcal;

  if (total === 0) {
    return [
      { key: "protein", label: "Protein", grams: 0, kcal: 0, pct: 0, color: "hsl(217 91% 60%)", dotClass: "bg-blue-500", barClass: "bg-blue-500", textClass: "text-blue-500 dark:text-blue-400" },
      { key: "carbs", label: "Carbs", grams: 0, kcal: 0, pct: 0, color: "hsl(38 92% 50%)", dotClass: "bg-amber-500", barClass: "bg-amber-500", textClass: "text-amber-500 dark:text-amber-400" },
      { key: "fat", label: "Fat", grams: 0, kcal: 0, pct: 0, color: "hsl(350 89% 60%)", dotClass: "bg-rose-500", barClass: "bg-rose-500", textClass: "text-rose-500 dark:text-rose-400" },
    ];
  }

  return [
    { key: "protein", label: "Protein", grams: macros.protein, kcal: proteinKcal, pct: Math.round((proteinKcal / total) * 100), color: "hsl(217 91% 60%)", dotClass: "bg-blue-500", barClass: "bg-blue-500", textClass: "text-blue-500 dark:text-blue-400" },
    { key: "carbs", label: "Carbs", grams: macros.carbs, kcal: carbsKcal, pct: Math.round((carbsKcal / total) * 100), color: "hsl(38 92% 50%)", dotClass: "bg-amber-500", barClass: "bg-amber-500", textClass: "text-amber-500 dark:text-amber-400" },
    { key: "fat", label: "Fat", grams: macros.fat, kcal: fatKcal, pct: Math.round((fatKcal / total) * 100), color: "hsl(350 89% 60%)", dotClass: "bg-rose-500", barClass: "bg-rose-500", textClass: "text-rose-500 dark:text-rose-400" },
  ];
}

function DonutChart({ segments, totalCalories }: { segments: MacroSegment[]; totalCalories: number }) {
  const size = 192;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;
  const gap = 4;

  let accumulated = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-muted/30" />
      {segments.map((seg) => {
        const pctFraction = seg.pct / 100;
        const dashLength = Math.max(0, circumference * pctFraction - gap);
        const dashOffset = circumference * (1 - accumulated) + circumference * 0.25 - gap / 2;
        accumulated += pctFraction;
        if (seg.pct === 0) return null;
        return (
          <circle key={seg.key} cx={cx} cy={cy} r={radius} fill="none" stroke={seg.color} strokeWidth={strokeWidth} strokeDasharray={`${dashLength} ${circumference - dashLength}`} strokeDashoffset={dashOffset} strokeLinecap="round" className="transition-all duration-500" />
        );
      })}
      <text x={cx} y={cy - 8} textAnchor="middle" className="fill-foreground font-bold" style={{ fontSize: 26 }}>{totalCalories.toLocaleString()}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 12 }}>kcal target</text>
    </svg>
  );
}

export function MacroTargetsCard({ targetMacros }: MacroTargetsCardProps) {
  const segments = buildSegments(targetMacros);
  const totalCalories = Math.round(targetMacros.calories);

  return (
    <div className="glass card-depth-2 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "50ms" }}>
      <h2 className="mb-5 font-mono text-xs font-semibold uppercase tracking-widest text-primary/60">
        Daily Targets
      </h2>
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <DonutChart segments={segments} totalCalories={totalCalories} />
        <div className="flex-1 space-y-4">
          {segments.map((seg) => (
            <div key={seg.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`inline-block size-2.5 rounded-full ${seg.dotClass}`} />
                  <span className="font-medium">{seg.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-mono font-bold ${seg.textClass}`}>{Math.round(seg.grams)}g</span>
                  <span className="w-10 text-right font-mono text-xs text-muted-foreground">{seg.pct}%</span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted/50">
                <div className={`h-1.5 rounded-full ${seg.barClass} transition-all duration-500`} style={{ width: `${seg.pct}%` }} />
              </div>
            </div>
          ))}
          <div className="rounded-lg glass px-3 py-1.5 text-xs text-muted-foreground/80">
            These are your daily plan targets
          </div>
        </div>
      </div>
    </div>
  );
}
