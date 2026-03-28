"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  generatePlanSchema,
  GOAL_VALUES,
  EXPERIENCE_VALUES,
  EQUIPMENT_VALUES,
  type GeneratePlanFormValues,
} from "../schemas/generate-plan-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormFieldWrapper } from "@/shared/components/form-field-wrapper";

type Props = {
  onSubmit: (data: GeneratePlanFormValues) => void;
  isSubmitting?: boolean;
  error?: string | null;
};

const GOAL_LABELS: Record<(typeof GOAL_VALUES)[number], string> = {
  LOSE_WEIGHT: "Lose Weight",
  GAIN_MUSCLE: "Gain Muscle",
  INCREASE_STRENGTH: "Increase Strength",
  IMPROVE_ENDURANCE: "Improve Endurance",
  MAINTAIN: "Maintain",
};

const EXPERIENCE_LABELS: Record<(typeof EXPERIENCE_VALUES)[number], string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

const EQUIPMENT_LABELS: Record<(typeof EQUIPMENT_VALUES)[number], string> = {
  BARBELL: "Barbell",
  DUMBBELL: "Dumbbell",
  CABLE: "Cable",
  MACHINE: "Machine",
  BODYWEIGHT: "Bodyweight",
  KETTLEBELL: "Kettlebell",
  RESISTANCE_BAND: "Resistance Band",
  OTHER: "Other",
};

export function GenerateWorkoutPlanForm({ onSubmit, isSubmitting, error }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GeneratePlanFormValues>({
    resolver: zodResolver(generatePlanSchema),
    defaultValues: {
      daysPerWeek: 3,
      durationWeeks: 8,
      sessionDurationMinutes: 60,
      availableEquipment: ["BODYWEIGHT"],
      injuryRestrictions: [],
    },
  });

  const goalValue = watch("goal");
  const experienceValue = watch("experienceLevel");
  const equipment = watch("availableEquipment") ?? [];

  function toggleEquipment(value: (typeof EQUIPMENT_VALUES)[number]) {
    const next = equipment.includes(value)
      ? equipment.filter((v) => v !== value)
      : [...equipment, value];
    setValue("availableEquipment", next, { shouldValidate: true });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormFieldWrapper label="Goal" error={errors.goal?.message} required htmlFor="goal">
        <Select
          value={goalValue ?? null}
          onValueChange={(v) => {
            if (v) setValue("goal", v as GeneratePlanFormValues["goal"], { shouldValidate: true });
          }}
        >
          <SelectTrigger id="goal">
            <SelectValue placeholder="Select your goal" />
          </SelectTrigger>
          <SelectContent>
            {GOAL_VALUES.map((g) => (
              <SelectItem key={g} value={g}>
                {GOAL_LABELS[g]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldWrapper>

      <FormFieldWrapper
        label="Experience Level"
        error={errors.experienceLevel?.message}
        required
        htmlFor="experienceLevel"
      >
        <Select
          value={experienceValue ?? null}
          onValueChange={(v) => {
            if (v) setValue("experienceLevel", v as GeneratePlanFormValues["experienceLevel"], { shouldValidate: true });
          }}
        >
          <SelectTrigger id="experienceLevel">
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            {EXPERIENCE_VALUES.map((e) => (
              <SelectItem key={e} value={e}>
                {EXPERIENCE_LABELS[e]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldWrapper>

      <div className="grid grid-cols-3 gap-4">
        <FormFieldWrapper
          label="Days / Week"
          error={errors.daysPerWeek?.message}
          required
          htmlFor="daysPerWeek"
        >
          <Input
            id="daysPerWeek"
            type="number"
            min={1}
            max={7}
            {...register("daysPerWeek", { valueAsNumber: true })}
          />
        </FormFieldWrapper>

        <FormFieldWrapper
          label="Duration (weeks)"
          error={errors.durationWeeks?.message}
          htmlFor="durationWeeks"
        >
          <Input
            id="durationWeeks"
            type="number"
            min={1}
            max={52}
            {...register("durationWeeks", { valueAsNumber: true })}
          />
        </FormFieldWrapper>

        <FormFieldWrapper
          label="Session (min)"
          error={errors.sessionDurationMinutes?.message}
          htmlFor="sessionDurationMinutes"
        >
          <Input
            id="sessionDurationMinutes"
            type="number"
            min={20}
            max={120}
            step={5}
            {...register("sessionDurationMinutes", { valueAsNumber: true })}
          />
        </FormFieldWrapper>
      </div>

      <FormFieldWrapper
        label="Available Equipment"
        error={errors.availableEquipment?.message}
        required
      >
        <div className="grid grid-cols-2 gap-3">
          {EQUIPMENT_VALUES.map((eq) => (
            <div key={eq} className="flex items-center gap-2">
              <Switch
                id={`eq-${eq}`}
                checked={equipment.includes(eq)}
                onCheckedChange={() => toggleEquipment(eq)}
              />
              <Label htmlFor={`eq-${eq}`} className="text-sm font-normal">
                {EQUIPMENT_LABELS[eq]}
              </Label>
            </div>
          ))}
        </div>
      </FormFieldWrapper>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Generating Plan..." : "Generate Workout Plan"}
      </Button>
    </form>
  );
}
