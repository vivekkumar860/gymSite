"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mealEntrySchema, type MealEntryFormValues } from "../schemas/meal-entry-schema";
import type { LogMealFormValues } from "../types/nutrition.types";
import type { FoodItem, Macros } from "@/api/schemas/nutrition.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FoodSearchInput } from "./food-search-input";

type MealEntryFormProps = {
  onSubmit: (values: LogMealFormValues) => void;
  isSubmitting?: boolean;
};

const mealTypeOptions = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
] as const;

export function MealEntryForm({ onSubmit, isSubmitting }: MealEntryFormProps) {
  const [selectedMacros, setSelectedMacros] = useState<Macros>({ calories: 0, protein: 0, carbs: 0, fat: 0 });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(mealEntrySchema),
    defaultValues: {
      mealType: "breakfast",
      foodItemId: "",
      foodName: "",
      quantity: 1,
    },
  });

  const mealType = watch("mealType");

  function handleFoodSelect(food: FoodItem) {
    setValue("foodItemId", food.id, { shouldValidate: true });
    setValue("foodName", food.name, { shouldValidate: true });
    setSelectedMacros(food.macros);
  }

  return (
    <form onSubmit={handleSubmit((data) => onSubmit({ ...data, macrosPerServing: selectedMacros } as LogMealFormValues))} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mealType">Meal Type</Label>
        <Select
          value={mealType}
          onValueChange={(val) =>
            setValue("mealType", val as MealEntryFormValues["mealType"], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select meal type" />
          </SelectTrigger>
          <SelectContent>
            {mealTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.mealType && (
          <p className="text-xs text-destructive">{errors.mealType.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Food Item</Label>
        <FoodSearchInput onSelect={handleFoodSelect} />
        {errors.foodItemId && (
          <p className="text-xs text-destructive">{errors.foodItemId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          step="0.1"
          min="0.1"
          max="9999"
          {...register("quantity")}
        />
        {errors.quantity && (
          <p className="text-xs text-destructive">{errors.quantity.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Logging..." : "Log Meal"}
      </Button>
    </form>
  );
}
