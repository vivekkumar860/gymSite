"use client";

import { useState } from "react";
import type { PlanMeal } from "@/api/schemas/nutrition.schema";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { MealItemRow } from "./meal-item-row";

type MealCardProps = {
  meal: PlanMeal;
  isRegenerating?: boolean;
  onRegenerate?: () => void;
};

const ACCENT_BORDERS = [
  "border-l-blue-500",
  "border-l-amber-500",
  "border-l-rose-500",
  "border-l-emerald-500",
] as const;

export function MealCard({ meal, isRegenerating, onRegenerate }: MealCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const accentBorder = ACCENT_BORDERS[(meal.order ?? 0) % ACCENT_BORDERS.length];

  return (
    <Card className={`glass card-depth-2 border-l-4 ${accentBorder} rounded-2xl interactive`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 text-primary text-xs font-medium px-2 py-0.5">
            Meal {(meal.order ?? 0) + 1}
          </span>
          <CardTitle className="text-base font-semibold">{meal.name}</CardTitle>
        </div>
        {onRegenerate && (
          <CardAction>
            <Button
              variant="ghost"
              size="icon-xs"
              disabled={isRegenerating}
              onClick={() => setConfirmOpen(true)}
            >
              <RefreshCwIcon className={`size-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {meal.foodItems.length === 0 ? (
          <div className="rounded-xl glass p-4 text-center text-sm text-muted-foreground/80">
            No food items in this meal.
          </div>
        ) : (
          <div className="space-y-0.5">
            {meal.foodItems.map((item, idx) => (
              <MealItemRow key={idx} item={item} />
            ))}
          </div>
        )}
        {meal.notes && (
          <p className="mt-2 text-xs text-muted-foreground/80 italic">{meal.notes}</p>
        )}
      </CardContent>
      <CardFooter className="bg-muted/20">
        <div className="flex w-full items-center justify-between">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Meal total
          </span>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="font-bold text-foreground">{Math.round(meal.macros.calories)} kcal</span>
            <span className="text-blue-500 dark:text-blue-400 font-medium">{Math.round(meal.macros.protein)}p</span>
            <span className="text-amber-500 dark:text-amber-400 font-medium">{Math.round(meal.macros.carbs)}c</span>
            <span className="text-rose-500 dark:text-rose-400 font-medium">{Math.round(meal.macros.fat)}f</span>
          </div>
        </div>
      </CardFooter>

      {onRegenerate && (
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title={`Regenerate ${meal.name}?`}
          description="This will replace the food items in this meal with a new generated set. Macro targets stay the same."
          confirmLabel={isRegenerating ? "Regenerating..." : "Regenerate"}
          onConfirm={onRegenerate}
        />
      )}
    </Card>
  );
}
