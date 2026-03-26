"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logSetSchema } from "../schemas/log-set-schema";
import type { LogSetFormValues } from "../types/workout.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type SetLoggerFormProps = {
  onSubmit: (values: LogSetFormValues) => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<LogSetFormValues>;
};

export function SetLoggerForm({
  onSubmit,
  isSubmitting = false,
  defaultValues,
}: SetLoggerFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(logSetSchema),
    defaultValues: {
      reps: 0,
      weight: 0,
      weightUnit: "kg",
      isWarmup: false,
      isDropSet: false,
      ...defaultValues,
    },
  });

  const weightUnit = watch("weightUnit");
  const isWarmup = watch("isWarmup");
  const isDropSet = watch("isDropSet");

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as LogSetFormValues))} className="space-y-4">
      {/* Reps */}
      <div className="space-y-1.5">
        <Label htmlFor="reps">Reps</Label>
        <Input
          id="reps"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 10"
          {...register("reps")}
          aria-invalid={!!errors.reps}
        />
        {errors.reps && (
          <p className="text-xs text-destructive">{errors.reps.message}</p>
        )}
      </div>

      {/* Weight + Unit toggle */}
      <div className="space-y-1.5">
        <Label htmlFor="weight">Weight</Label>
        <div className="flex items-center gap-2">
          <Input
            id="weight"
            type="number"
            inputMode="decimal"
            step="any"
            placeholder="e.g. 60"
            className="flex-1"
            {...register("weight")}
            aria-invalid={!!errors.weight}
          />
          <div className="flex items-center gap-1 rounded-lg border px-2 py-1">
            <button
              type="button"
              className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                weightUnit === "kg"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setValue("weightUnit", "kg")}
            >
              kg
            </button>
            <button
              type="button"
              className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                weightUnit === "lbs"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setValue("weightUnit", "lbs")}
            >
              lbs
            </button>
          </div>
        </div>
        {errors.weight && (
          <p className="text-xs text-destructive">{errors.weight.message}</p>
        )}
      </div>

      {/* RPE (optional) */}
      <div className="space-y-1.5">
        <Label htmlFor="rpe">RPE (optional)</Label>
        <Input
          id="rpe"
          type="number"
          inputMode="decimal"
          step="0.5"
          min="0"
          max="10"
          placeholder="0 - 10"
          {...register("rpe")}
          aria-invalid={!!errors.rpe}
        />
        {errors.rpe && (
          <p className="text-xs text-destructive">{errors.rpe.message}</p>
        )}
      </div>

      {/* Warmup / Drop set switches */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            checked={isWarmup}
            onCheckedChange={(checked: boolean) => setValue("isWarmup", checked)}
            id="isWarmup"
          />
          <Label htmlFor="isWarmup">Warmup</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={isDropSet}
            onCheckedChange={(checked: boolean) => setValue("isDropSet", checked)}
            id="isDropSet"
          />
          <Label htmlFor="isDropSet">Drop set</Label>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Log Set"}
      </Button>
    </form>
  );
}
