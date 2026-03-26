"use client";

import type { MealItem } from "@/api/schemas/nutrition.schema";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

type MealItemRowProps = {
  item: MealItem;
  onDelete?: () => void;
};

export function MealItemRow({ item, onDelete }: MealItemRowProps) {
  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.foodName}</p>
        <p className="text-xs text-muted-foreground">
          {item.quantity} serving{item.quantity !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>{Math.round(item.macros.calories)} kcal</span>
        <span>{Math.round(item.macros.protein)}p</span>
        <span>{Math.round(item.macros.carbs)}c</span>
        <span>{Math.round(item.macros.fat)}f</span>
      </div>
      {onDelete && (
        <Button variant="ghost" size="icon-xs" onClick={onDelete}>
          <Trash2Icon className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
