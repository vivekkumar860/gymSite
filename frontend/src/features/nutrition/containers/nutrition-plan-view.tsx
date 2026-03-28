"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useGenerateNutritionPlan } from "../hooks/use-generate-nutrition-plan";
import { useActiveNutritionPlan } from "../hooks/use-daily-nutrition";
import { GenerateNutritionPlanForm } from "../components/generate-nutrition-plan-form";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ApiError } from "@/api/client";
import { formatErrorMessage } from "@/shared/utils/format-error";
import { TriangleAlertIcon, SparklesIcon } from "lucide-react";
import type { GenerateNutritionPlanFormValues } from "../schemas/generate-nutrition-plan-schema";

export function NutritionPlanView() {
  const generatePlan = useGenerateNutritionPlan();
  const { data: existingPlan } = useActiveNutritionPlan();
  const [formError, setFormError] = useState<string | null>(null);

  function handleSubmit(data: GenerateNutritionPlanFormValues) {
    setFormError(null);
    generatePlan.mutate(data, {
      onSuccess: () => {
        toast.success("Nutrition plan generated");
      },
      onError: (err) => {
        if (err instanceof ApiError && err.statusCode === 400) {
          const fieldMessages = err.errors
            ? Object.values(err.errors).flat().join(". ")
            : "";
          setFormError(
            `Could not generate plan: ${fieldMessages || err.message}`,
          );
        } else {
          setFormError(formatErrorMessage(err));
        }
      },
    });
  }

  return (
    <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 animate-float">
          <SparklesIcon className="size-6 text-primary/60" />
        </div>
        <PageHeader
          title="Create Nutrition Plan"
          description="Enter your details and preferences to generate a personalised nutrition plan."
        />
      </div>

      <Card className="mx-auto max-w-lg glass card-depth-2 rounded-2xl">
        <CardContent className="pt-6 p-6 space-y-4 sm:p-8">
          {existingPlan && (
            <div className="flex items-start gap-2 rounded-xl border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800 dark:border-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-200">
              <TriangleAlertIcon className="mt-0.5 size-4 shrink-0" />
              <p>
                You already have an active plan: <strong>{existingPlan.planName}</strong>.
                Submitting this form will replace it.
              </p>
            </div>
          )}

          <GenerateNutritionPlanForm
            onSubmit={handleSubmit}
            isSubmitting={generatePlan.isPending}
            error={formError}
            prefill={existingPlan ? {
              activityLevel: existingPlan.activityLevel ?? undefined,
              goal: existingPlan.goalType ?? undefined,
              dietPreference: existingPlan.mealPlanType ?? undefined,
              budgetPreference: existingPlan.budgetPreference ?? undefined,
            } : undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
}
