"use client";

import type { Meal } from "@/api/schemas/nutrition.schema";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { MealItemRow } from "./meal-item-row";

type MealCardProps = {
  meal: Meal;
  onAddItem?: () => void;
  onDeleteItem?: (itemId: string) => void;
};

const mealLabels: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

export function MealCard({ meal, onAddItem, onDeleteItem }: MealCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{mealLabels[meal.name] ?? meal.name}</CardTitle>
        {onAddItem && (
          <CardAction>
            <Button variant="ghost" size="icon-xs" onClick={onAddItem}>
              <PlusIcon className="size-4" />
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {meal.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No items logged yet.</p>
        ) : (
          <div className="divide-y">
            {meal.items.map((item) => (
              <MealItemRow
                key={item.id}
                item={item}
                onDelete={onDeleteItem ? () => onDeleteItem(item.id) : undefined}
              />
            ))}
          </div>
        )}
      </CardContent>
      {meal.items.length > 0 && (
        <CardFooter>
          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Total</span>
            <div className="flex items-center gap-3">
              <span>{Math.round(meal.totalMacros.calories)} kcal</span>
              <span>{Math.round(meal.totalMacros.protein)}p</span>
              <span>{Math.round(meal.totalMacros.carbs)}c</span>
              <span>{Math.round(meal.totalMacros.fat)}f</span>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
