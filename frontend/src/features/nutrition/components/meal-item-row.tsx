"use client";

import type { PlanFoodItem } from "@/api/schemas/nutrition.schema";

type MealItemRowProps = {
  item: PlanFoodItem;
};

export function MealItemRow({ item }: MealItemRowProps) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg px-2 py-2.5 -mx-2 transition-colors hover:bg-primary/5">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.name}</p>
        {item.quantity && (
          <p className="text-xs text-muted-foreground/80">{item.quantity}</p>
        )}
      </div>
      <div className="flex items-center gap-3 text-xs font-mono">
        <span className="font-bold text-foreground">{Math.round(item.calories)} kcal</span>
        <span className="text-blue-500 dark:text-blue-400">{Math.round(item.protein)}p</span>
        <span className="text-amber-500 dark:text-amber-400">{Math.round(item.carbs)}c</span>
        <span className="text-rose-500 dark:text-rose-400">{Math.round(item.fat)}f</span>
      </div>
    </div>
  );
}
