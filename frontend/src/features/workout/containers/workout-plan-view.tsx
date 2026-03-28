"use client";

import { useState } from "react";
import { useGenerateWorkoutPlan } from "../hooks/use-generate-workout-plan";
import { GenerateWorkoutPlanForm } from "../components/generate-workout-plan-form";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ApiError } from "@/api/client";
import { formatErrorMessage } from "@/shared/utils/format-error";
import type { GeneratePlanFormValues } from "../schemas/generate-plan-schema";

export function WorkoutPlanView() {
  const generatePlan = useGenerateWorkoutPlan();
  const [formError, setFormError] = useState<string | null>(null);

  function handleSubmit(data: GeneratePlanFormValues) {
    setFormError(null);
    generatePlan.mutate(data, {
      onError: (err) => {
        if (err instanceof ApiError && err.errors) {
          const fieldMessages = Object.values(err.errors).flat();
          setFormError(fieldMessages.join(". ") || err.message);
        } else {
          setFormError(formatErrorMessage(err));
        }
      },
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Workout Plan"
        description="Tell us about your goals and we'll generate a personalised plan."
      />
      <Card className="mx-auto max-w-lg">
        <CardContent className="pt-6">
          <GenerateWorkoutPlanForm
            onSubmit={handleSubmit}
            isSubmitting={generatePlan.isPending}
            error={formError}
          />
        </CardContent>
      </Card>
    </div>
  );
}
