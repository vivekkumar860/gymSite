"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StepLayout } from "./step-layout";
import type { OnboardingFormData } from "../schemas/onboarding.schema";

type SummaryStepProps = {
  formData: Partial<OnboardingFormData>;
  onSubmit: () => void;
  onBack: () => void;
  onEditStep: (step: number) => void;
  isSubmitting: boolean;
  submitError?: string | null;
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function SummaryRow({
  label,
  value,
  stepIndex,
  onEdit,
}: {
  label: string;
  value: string | undefined;
  stepIndex: number;
  onEdit: (step: number) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value || "Not set"}</p>
      </div>
      <button
        type="button"
        className="shrink-0 text-sm text-primary hover:underline"
        onClick={() => onEdit(stepIndex)}
        aria-label={`Edit ${label}`}
      >
        Edit
      </button>
    </div>
  );
}

export function SummaryStep({
  formData,
  onSubmit,
  onBack,
  onEditStep,
  isSubmitting,
  submitError,
}: SummaryStepProps) {
  const workoutDays = formData.preferredWorkoutDays
    ?.sort((a, b) => a - b)
    .map((d) => DAY_NAMES[d])
    .join(", ");

  const equipment = formData.availableEquipment
    ?.map(formatLabel)
    .join(", ");

  const injuries = formData.hasInjuries
    ? formData.injuredAreas?.map(formatLabel).join(", ") || "Yes (no areas specified)"
    : "None";

  return (
    <StepLayout
      title="Review Your Profile"
      description="Make sure everything looks good before we get started."
      onBack={onBack}
      onNext={onSubmit}
      isLastStep
      isSubmitting={isSubmitting}
    >
      <Card>
        <CardContent className="space-y-4 py-4">
          <SummaryRow
            label="Body Details"
            value={[
              formData.height ? `${formData.height} cm` : null,
              formData.weight ? `${formData.weight} kg` : null,
              formData.gender ? formatLabel(formData.gender) : null,
            ]
              .filter(Boolean)
              .join(" / ") || "Not provided"}
            stepIndex={0}
            onEdit={onEditStep}
          />
          <Separator />
          <SummaryRow
            label="Fitness Goal"
            value={formData.fitnessGoal ? formatLabel(formData.fitnessGoal) : undefined}
            stepIndex={1}
            onEdit={onEditStep}
          />
          <Separator />
          <SummaryRow
            label="Experience & Schedule"
            value={[
              formData.experienceLevel ? formatLabel(formData.experienceLevel) : null,
              workoutDays ? `Days: ${workoutDays}` : null,
            ]
              .filter(Boolean)
              .join(" / ") || undefined}
            stepIndex={2}
            onEdit={onEditStep}
          />
          <Separator />
          <SummaryRow
            label="Equipment"
            value={equipment}
            stepIndex={3}
            onEdit={onEditStep}
          />
          <Separator />
          <SummaryRow
            label="Injuries"
            value={injuries}
            stepIndex={4}
            onEdit={onEditStep}
          />
          <Separator />
          <SummaryRow
            label="Diet Preference"
            value={formData.dietType ? formatLabel(formData.dietType) : undefined}
            stepIndex={5}
            onEdit={onEditStep}
          />
        </CardContent>
      </Card>

      {submitError && (
        <p className="text-sm text-destructive" role="alert">
          {submitError}
        </p>
      )}
    </StepLayout>
  );
}
