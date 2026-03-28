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
      isFailure: false,
      ...defaultValues,
    },
  });

  const weightUnit = watch("weightUnit");
  const isWarmup = watch("isWarmup");
  const isFailure = watch("isFailure");

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as LogSetFormValues))} className="space-y-4">
      {/* Reps */}
      <div className="space-y-1.5">
        <Label htmlFor="reps" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Reps</Label>
        <Input
          id="reps"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 10"
          className="text-lg font-mono font-bold"
          {...register("reps")}
          aria-invalid={!!errors.reps}
        />
        {errors.reps && (
          <p className="text-xs text-destructive">{errors.reps.message}</p>
        )}
      </div>

      {/* Weight + Unit toggle */}
      <div className="space-y-1.5">
        <Label htmlFor="weight" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Weight</Label>
        <div className="flex items-center gap-2">
          <Input
            id="weight"
            type="number"
            inputMode="decimal"
            step="any"
            placeholder="e.g. 60"
            className="flex-1 text-lg font-mono font-bold"
            {...register("weight")}
            aria-invalid={!!errors.weight}
          />
          <div className="flex items-center gap-1 rounded-xl glass px-2 py-1.5">
            <button
              type="button"
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all duration-200 ${
                weightUnit === "kg"
                  ? "bg-primary text-primary-foreground glow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setValue("weightUnit", "kg")}
            >
              kg
            </button>
            <button
              type="button"
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all duration-200 ${
                weightUnit === "lbs"
                  ? "bg-primary text-primary-foreground glow-sm"
                  : "text-muted-foreground hover:text-foreground"
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
        <Label htmlFor="rpe" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">RPE (optional)</Label>
        <Input
          id="rpe"
          type="number"
          inputMode="decimal"
          step="0.5"
          min="0"
          max="10"
          placeholder="0 - 10"
          className="font-mono"
          {...register("rpe")}
          aria-invalid={!!errors.rpe}
        />
        {errors.rpe && (
          <p className="text-xs text-destructive">{errors.rpe.message}</p>
        )}
      </div>

      {/* Warmup / To-failure switches */}
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
            checked={isFailure}
            onCheckedChange={(checked: boolean) => setValue("isFailure", checked)}
            id="isFailure"
          />
          <Label htmlFor="isFailure">To failure</Label>
        </div>
      </div>

      <Button type="submit" className="w-full glow-primary" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Log Set"}
      </Button>
    </form>
  );
}
