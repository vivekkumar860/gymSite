"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createHabitSchema } from "../schemas/create-habit-schema";
import type { CreateHabitFormValues } from "../types/habits.types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type CreateHabitFormProps = {
  onSubmit: (values: CreateHabitFormValues) => void;
  isSubmitting?: boolean;
};

const PREDEFINED_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
];

export function CreateHabitForm({
  onSubmit,
  isSubmitting,
}: CreateHabitFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createHabitSchema),
    defaultValues: {
      name: "",
      description: "",
      frequency: "DAILY",
      targetCount: 1,
      color: undefined,
      icon: undefined,
    },
  });

  const selectedColor = watch("color");
  const selectedFrequency = watch("frequency");

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as CreateHabitFormValues))} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="habit-name">Name</Label>
        <Input
          id="habit-name"
          placeholder="e.g. Drink water"
          {...register("name")}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="habit-description">Description</Label>
        <Textarea
          id="habit-description"
          placeholder="Optional description..."
          {...register("description")}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Frequency */}
      <div className="space-y-2">
        <Label>Frequency</Label>
        <Select
          value={selectedFrequency}
          onValueChange={(val) => {
            if (val) setValue("frequency", val as "DAILY" | "WEEKLY");
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DAILY">Daily</SelectItem>
            <SelectItem value="WEEKLY">Weekly</SelectItem>
          </SelectContent>
        </Select>
        {errors.frequency && (
          <p className="text-xs text-destructive">
            {errors.frequency.message}
          </p>
        )}
      </div>

      {/* Target count */}
      <div className="space-y-2">
        <Label htmlFor="habit-target">Target count</Label>
        <Input
          id="habit-target"
          type="number"
          min={1}
          max={100}
          {...register("targetCount")}
          aria-invalid={!!errors.targetCount}
        />
        {errors.targetCount && (
          <p className="text-xs text-destructive">
            {errors.targetCount.message}
          </p>
        )}
      </div>

      {/* Color picker */}
      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={cn(
                "size-7 rounded-full border-2 transition-transform hover:scale-110",
                selectedColor === color
                  ? "border-foreground scale-110"
                  : "border-transparent",
              )}
              style={{ backgroundColor: color }}
              onClick={() => setValue("color", color)}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Habit"}
      </Button>
    </form>
  );
}
