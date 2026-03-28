"use client";

type PlanStatsRowProps = {
  bmr: number | null;
  tdee: number | null;
  dailyTarget: number;
};

type StatChip = { label: string; value: number };

export function PlanStatsRow({ bmr, tdee, dailyTarget }: PlanStatsRowProps) {
  if (dailyTarget <= 0) return null;

  const chips: StatChip[] = [];
  if (bmr && bmr > 0) chips.push({ label: "BMR", value: bmr });
  if (tdee && tdee > 0) chips.push({ label: "TDEE", value: tdee });
  chips.push({ label: "Daily Target", value: dailyTarget });

  const showExplanation = chips.length === 3;

  return (
    <div className="animate-slide-up" style={{ animationDelay: "25ms" }}>
      <div
        className={`grid gap-3 ${
          chips.length === 3
            ? "grid-cols-3"
            : chips.length === 2
              ? "grid-cols-2"
              : "grid-cols-1 max-w-xs mx-auto"
        }`}
      >
        {chips.map((chip) => (
          <div
            key={chip.label}
            className="glass card-depth-1 rounded-xl p-4 text-center space-y-1"
          >
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-primary/60">
              {chip.label}
            </p>
            <p className="text-xl font-black tabular-nums">
              {chip.value.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">kcal</span>
            </p>
          </div>
        ))}
      </div>
      {showExplanation && (
        <p className="text-xs text-muted-foreground/80 text-center mt-2">
          BMR &rarr; TDEE &rarr; Daily Target: how your calorie goal was calculated
        </p>
      )}
    </div>
  );
}
