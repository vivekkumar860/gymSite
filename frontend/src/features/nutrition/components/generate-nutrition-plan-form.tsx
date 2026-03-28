"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  generateNutritionPlanSchema,
  GENDER_VALUES,
  ACTIVITY_LEVEL_VALUES,
  GOAL_VALUES,
  DIET_PREFERENCE_VALUES,
  BUDGET_PREFERENCE_VALUES,
  type GenerateNutritionPlanFormValues,
} from "../schemas/generate-nutrition-plan-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormFieldWrapper } from "@/shared/components/form-field-wrapper";
import { ArrowRightIcon, LoaderCircleIcon, TriangleAlertIcon } from "lucide-react";

type PrefillValues = {
  activityLevel?: string;
  goal?: string;
  dietPreference?: string;
  budgetPreference?: string;
};

type Props = {
  onSubmit: (data: GenerateNutritionPlanFormValues) => void;
  isSubmitting?: boolean;
  error?: string | null;
  prefill?: PrefillValues;
};

const GENDER_LABELS: Record<(typeof GENDER_VALUES)[number], string> = {
  MALE: "Male",
  FEMALE: "Female",
};

const ACTIVITY_LABELS: Record<(typeof ACTIVITY_LEVEL_VALUES)[number], string> = {
  SEDENTARY: "Sedentary",
  LIGHTLY_ACTIVE: "Lightly Active",
  MODERATELY_ACTIVE: "Moderately Active",
  VERY_ACTIVE: "Very Active",
  EXTREMELY_ACTIVE: "Extremely Active",
};

const ACTIVITY_DESCRIPTIONS: Record<(typeof ACTIVITY_LEVEL_VALUES)[number], string> = {
  SEDENTARY: "Little or no exercise, desk job",
  LIGHTLY_ACTIVE: "Light exercise 1-3 days/week",
  MODERATELY_ACTIVE: "Moderate exercise 3-5 days/week",
  VERY_ACTIVE: "Hard exercise 6-7 days/week",
  EXTREMELY_ACTIVE: "Very hard exercise, physical job",
};

const GOAL_LABELS: Record<(typeof GOAL_VALUES)[number], string> = {
  LOSE_WEIGHT: "Lose Weight",
  GAIN_MUSCLE: "Gain Muscle",
  INCREASE_STRENGTH: "Increase Strength",
  IMPROVE_ENDURANCE: "Improve Endurance",
  MAINTAIN: "Maintain",
  CUSTOM: "Custom",
};

const DIET_LABELS: Record<(typeof DIET_PREFERENCE_VALUES)[number], string> = {
  INDIAN_VEGETARIAN: "Indian Vegetarian",
  INDIAN_NON_VEG: "Indian Non-Veg",
  VEGAN: "Vegan",
  HOSTEL_BUDGET: "Hostel Budget",
  OFFICE_GOING: "Office Going",
};

const BUDGET_LABELS: Record<(typeof BUDGET_PREFERENCE_VALUES)[number], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export function GenerateNutritionPlanForm({ onSubmit, isSubmitting, error, prefill }: Props) {
  const form = useForm<GenerateNutritionPlanFormValues>({
    resolver: zodResolver(generateNutritionPlanSchema),
    defaultValues: {
      age: 25,
      heightCm: 170,
      weightKg: 70,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = form;

  const hasAppliedPrefill = useRef(false);
  useEffect(() => {
    if (!prefill || hasAppliedPrefill.current || isDirty) return;
    hasAppliedPrefill.current = true;
    const current = form.getValues();
    form.reset({
      ...current,
      ...(prefill.activityLevel ? { activityLevel: prefill.activityLevel as GenerateNutritionPlanFormValues["activityLevel"] } : {}),
      ...(prefill.goal ? { goal: prefill.goal as GenerateNutritionPlanFormValues["goal"] } : {}),
      ...(prefill.dietPreference ? { dietPreference: prefill.dietPreference as GenerateNutritionPlanFormValues["dietPreference"] } : {}),
      ...(prefill.budgetPreference ? { budgetPreference: prefill.budgetPreference as GenerateNutritionPlanFormValues["budgetPreference"] } : {}),
    }, { keepDirty: false, keepTouched: false });
  }, [prefill, isDirty, form]);

  const gender = watch("gender");
  const activityLevel = watch("activityLevel");
  const goal = watch("goal");
  const dietPreference = watch("dietPreference");
  const budgetPreference = watch("budgetPreference");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Section 1 — About You */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          About You
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FormFieldWrapper label="Gender" error={errors.gender?.message} required htmlFor="gender">
            <Select
              value={gender ?? null}
              onValueChange={(v) => {
                if (v) setValue("gender", v as GenerateNutritionPlanFormValues["gender"], { shouldValidate: true });
              }}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {GENDER_VALUES.map((g) => (
                  <SelectItem key={g} value={g}>{GENDER_LABELS[g]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldWrapper>

          <FormFieldWrapper label="Age" error={errors.age?.message} required htmlFor="age">
            <Input
              id="age"
              type="number"
              min={13}
              max={100}
              {...register("age", { valueAsNumber: true })}
            />
          </FormFieldWrapper>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormFieldWrapper label="Height (cm)" error={errors.heightCm?.message} required htmlFor="heightCm">
            <Input
              id="heightCm"
              type="number"
              min={100}
              max={250}
              step="0.1"
              {...register("heightCm", { valueAsNumber: true })}
            />
          </FormFieldWrapper>

          <FormFieldWrapper label="Weight (kg)" error={errors.weightKg?.message} required htmlFor="weightKg">
            <Input
              id="weightKg"
              type="number"
              min={30}
              max={300}
              step="0.1"
              {...register("weightKg", { valueAsNumber: true })}
            />
          </FormFieldWrapper>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border/50" />

      {/* Section 2 — Your Activity */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Your Activity
        </h3>
        <FormFieldWrapper label="Activity Level" error={errors.activityLevel?.message} required htmlFor="activityLevel">
          <Select
            value={activityLevel ?? null}
            onValueChange={(v) => {
              if (v) setValue("activityLevel", v as GenerateNutritionPlanFormValues["activityLevel"], { shouldValidate: true });
            }}
          >
            <SelectTrigger id="activityLevel">
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent>
              {ACTIVITY_LEVEL_VALUES.map((a) => (
                <SelectItem key={a} value={a}>{ACTIVITY_LABELS[a]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {activityLevel && (
            <p className="text-xs text-muted-foreground mt-1">
              {ACTIVITY_DESCRIPTIONS[activityLevel]}
            </p>
          )}
        </FormFieldWrapper>
      </div>

      {/* Divider */}
      <div className="border-t border-border/50" />

      {/* Section 3 — Your Goals */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Your Goals
        </h3>
        <FormFieldWrapper label="Goal" error={errors.goal?.message} required htmlFor="goal">
          <Select
            value={goal ?? null}
            onValueChange={(v) => {
              if (v) setValue("goal", v as GenerateNutritionPlanFormValues["goal"], { shouldValidate: true });
            }}
          >
            <SelectTrigger id="goal">
              <SelectValue placeholder="Select your goal" />
            </SelectTrigger>
            <SelectContent>
              {GOAL_VALUES.map((g) => (
                <SelectItem key={g} value={g}>{GOAL_LABELS[g]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldWrapper>

        <div className="grid grid-cols-2 gap-4">
          <FormFieldWrapper label="Diet Preference" error={errors.dietPreference?.message} required htmlFor="dietPreference">
            <Select
              value={dietPreference ?? null}
              onValueChange={(v) => {
                if (v) setValue("dietPreference", v as GenerateNutritionPlanFormValues["dietPreference"], { shouldValidate: true });
              }}
            >
              <SelectTrigger id="dietPreference">
                <SelectValue placeholder="Select diet" />
              </SelectTrigger>
              <SelectContent>
                {DIET_PREFERENCE_VALUES.map((d) => (
                  <SelectItem key={d} value={d}>{DIET_LABELS[d]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldWrapper>

          <FormFieldWrapper label="Budget" error={errors.budgetPreference?.message} required htmlFor="budgetPreference">
            <Select
              value={budgetPreference ?? null}
              onValueChange={(v) => {
                if (v) setValue("budgetPreference", v as GenerateNutritionPlanFormValues["budgetPreference"], { shouldValidate: true });
              }}
            >
              <SelectTrigger id="budgetPreference">
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_PREFERENCE_VALUES.map((b) => (
                  <SelectItem key={b} value={b}>{BUDGET_LABELS[b]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldWrapper>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 flex items-start gap-2">
          <TriangleAlertIcon className="size-4 mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
        {isSubmitting ? (
          <>
            <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
            Generating Plan...
          </>
        ) : (
          <>
            Generate Nutrition Plan
            <ArrowRightIcon className="ml-2 size-4" />
          </>
        )}
      </Button>
    </form>
  );
}
