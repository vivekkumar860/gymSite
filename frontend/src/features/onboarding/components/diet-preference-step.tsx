"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { StepLayout } from "./step-layout";
import {
  dietPreferenceSchema,
  dietTypes,
  type DietPreferenceData,
} from "../schemas/diet-preference.schema";

type DietPreferenceStepProps = {
  defaultValues: Partial<DietPreferenceData>;
  onSubmit: (data: DietPreferenceData) => void;
  onBack: () => void;
};

const DIET_LABELS: Record<(typeof dietTypes)[number], string> = {
  no_preference: "No Preference",
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  keto: "Keto",
  paleo: "Paleo",
  mediterranean: "Mediterranean",
  high_protein: "High Protein",
};

const DIET_DESCRIPTIONS: Record<(typeof dietTypes)[number], string> = {
  no_preference: "I eat everything",
  vegetarian: "No meat, but dairy and eggs are fine",
  vegan: "No animal products",
  keto: "High fat, very low carb",
  paleo: "Whole foods, no processed items",
  mediterranean: "Plant-based with healthy fats",
  high_protein: "Focused on protein intake",
};

export function DietPreferenceStep({
  defaultValues,
  onSubmit,
  onBack,
}: DietPreferenceStepProps) {
  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<DietPreferenceData>({
    resolver: zodResolver(dietPreferenceSchema),
    defaultValues,
  });

  const selected = watch("dietType");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepLayout
        title="Diet Preference"
        description="Choose a diet style that fits your lifestyle."
        onBack={onBack}
      >
        <div className="space-y-3">
          <div
            className="grid gap-2"
            role="radiogroup"
            aria-label="Diet preference"
          >
            {dietTypes.map((diet) => (
              <Card
                key={diet}
                role="radio"
                aria-checked={selected === diet}
                tabIndex={0}
                className={`cursor-pointer transition-colors hover:border-primary ${
                  selected === diet ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() =>
                  setValue("dietType", diet, { shouldValidate: true })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setValue("dietType", diet, { shouldValidate: true });
                  }
                }}
              >
                <CardContent className="flex flex-col gap-0.5 py-3">
                  <span className="text-sm font-medium">
                    {DIET_LABELS[diet]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {DIET_DESCRIPTIONS[diet]}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
          {errors.dietType && (
            <p className="text-sm text-destructive" role="alert">
              {errors.dietType.message}
            </p>
          )}
        </div>
      </StepLayout>
    </form>
  );
}
