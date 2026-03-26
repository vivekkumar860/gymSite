"use client";

import { useState } from "react";
import { useDailyNutrition } from "../hooks/use-daily-nutrition";
import { useLogMeal } from "../hooks/use-log-meal";
import { MacrosSummary } from "../components/macros-summary";
import { MealCard } from "../components/meal-card";
import { MealEntryForm } from "../components/meal-entry-form";
import type { LogMealFormValues, MealType } from "../types/nutrition.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

function toISODate(date: Date): string {
  return date.toISOString().split("T")[0];
}

const mealOrder: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

export function NutritionDailyView() {
  const [selectedDate, setSelectedDate] = useState(() => toISODate(new Date()));
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [activeMealType, setActiveMealType] = useState<MealType>("breakfast");

  const { data, isLoading, isError, error } = useDailyNutrition(selectedDate);
  const logMeal = useLogMeal();

  function handleAddItem(mealType: MealType) {
    setActiveMealType(mealType);
    setShowEntryForm(true);
  }

  function handleFormSubmit(values: LogMealFormValues) {
    const scaledMacros = {
      calories: Math.round(values.macrosPerServing.calories * values.quantity),
      protein: Math.round(values.macrosPerServing.protein * values.quantity),
      carbs: Math.round(values.macrosPerServing.carbs * values.quantity),
      fat: Math.round(values.macrosPerServing.fat * values.quantity),
    };

    logMeal.mutate(
      {
        name: values.mealType,
        items: [
          {
            id: crypto.randomUUID(),
            foodItemId: values.foodItemId,
            foodName: values.foodName,
            quantity: values.quantity,
            macros: scaledMacros,
          },
        ],
        totalMacros: scaledMacros,
        loggedAt: new Date().toISOString(),
      },
      {
        onSuccess: () => setShowEntryForm(false),
      },
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">Loading nutrition data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load nutrition data."}
        </p>
      </div>
    );
  }

  const meals = data?.meals ?? [];
  const sortedMeals = [...meals].sort(
    (a, b) => mealOrder.indexOf(a.name) - mealOrder.indexOf(b.name),
  );

  // Build placeholder cards for meal types with no entries
  const existingMealNames = new Set(meals.map((m) => m.name));
  const emptyMealTypes = mealOrder.filter((t) => !existingMealNames.has(t));

  return (
    <div className="space-y-6">
      {/* Date picker */}
      <div className="flex items-center gap-3">
        <Label htmlFor="nutrition-date">Date</Label>
        <Input
          id="nutrition-date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-auto"
        />
      </div>

      {/* Macros summary */}
      {data && (
        <MacrosSummary
          current={data.totalMacros}
          target={data.targetMacros}
        />
      )}

      {/* Meal cards */}
      <div className="space-y-4">
        {sortedMeals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            onAddItem={() => handleAddItem(meal.name)}
          />
        ))}
        {emptyMealTypes.map((mealType) => (
          <MealCard
            key={mealType}
            meal={{
              id: mealType,
              name: mealType,
              items: [],
              totalMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
              loggedAt: selectedDate,
            }}
            onAddItem={() => handleAddItem(mealType)}
          />
        ))}
      </div>

      {/* Entry form */}
      {showEntryForm && (
        <Card>
          <CardHeader>
            <CardTitle>Log a Meal Item</CardTitle>
          </CardHeader>
          <CardContent>
            <MealEntryForm
              onSubmit={handleFormSubmit}
              isSubmitting={logMeal.isPending}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
