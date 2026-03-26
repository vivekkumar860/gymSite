"use client";

import { useOnboardingStore } from "../store/onboarding-store";
import { useCompleteOnboarding } from "../hooks/use-complete-onboarding";
import { OnboardingStepIndicator } from "../components/onboarding-step-indicator";
import { BodyDetailsStep } from "../components/body-details-step";
import { GoalSelectionStep } from "../components/goal-selection-step";
import { ActivityScheduleStep } from "../components/activity-schedule-step";
import { EquipmentAccessStep } from "../components/equipment-access-step";
import { InjuryRestrictionsStep } from "../components/injury-restrictions-step";
import { DietPreferenceStep } from "../components/diet-preference-step";
import { SummaryStep } from "../components/summary-step";
import { onboardingSchema } from "../schemas/onboarding.schema";
import type { OnboardingFormData } from "../schemas/onboarding.schema";
import { clearOnboardingStorage } from "../store/onboarding-store";
import type { OnboardingData } from "@/api/schemas/user.schema";
import { useState } from "react";

export function OnboardingFlow() {
  const store = useOnboardingStore();
  const completeOnboarding = useCompleteOnboarding();
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleStepSubmit(stepData: Partial<OnboardingFormData>) {
    store.mergeStepData(stepData);
  }

  function handleFinalSubmit() {
    setSubmitError(null);
    const result = onboardingSchema.safeParse(store.formData);

    if (!result.success) {
      setSubmitError(
        "Some required fields are missing. Please go back and fill them in.",
      );
      return;
    }

    const payload: OnboardingData = {
      fitnessGoal: result.data.fitnessGoal,
      experienceLevel: result.data.experienceLevel,
      preferredWorkoutDays: result.data.preferredWorkoutDays,
      height: result.data.height,
      weight: result.data.weight,
      dateOfBirth: result.data.dateOfBirth,
      gender: result.data.gender,
      availableEquipment: result.data.availableEquipment,
      hasInjuries: result.data.hasInjuries,
      injuredAreas: result.data.injuredAreas,
      injuryNotes: result.data.injuryNotes,
      dietType: result.data.dietType,
      allergies: result.data.allergies,
    };

    completeOnboarding.mutate(payload, {
      onSuccess: () => {
        clearOnboardingStorage();
      },
      onError: (error) => {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        );
      },
    });
  }

  function renderStep() {
    switch (store.currentStep) {
      case 0:
        return (
          <BodyDetailsStep
            defaultValues={store.formData}
            onSubmit={handleStepSubmit}
            onBack={store.goBack}
            isFirstStep={store.isFirstStep}
          />
        );
      case 1:
        return (
          <GoalSelectionStep
            defaultValues={store.formData}
            onSubmit={handleStepSubmit}
            onBack={store.goBack}
          />
        );
      case 2:
        return (
          <ActivityScheduleStep
            defaultValues={store.formData}
            onSubmit={handleStepSubmit}
            onBack={store.goBack}
          />
        );
      case 3:
        return (
          <EquipmentAccessStep
            defaultValues={store.formData}
            onSubmit={handleStepSubmit}
            onBack={store.goBack}
          />
        );
      case 4:
        return (
          <InjuryRestrictionsStep
            defaultValues={store.formData}
            onSubmit={handleStepSubmit}
            onBack={store.goBack}
          />
        );
      case 5:
        return (
          <DietPreferenceStep
            defaultValues={store.formData}
            onSubmit={handleStepSubmit}
            onBack={store.goBack}
          />
        );
      case 6:
        return (
          <SummaryStep
            formData={store.formData}
            onSubmit={handleFinalSubmit}
            onBack={store.goBack}
            onEditStep={store.goToStep}
            isSubmitting={completeOnboarding.isPending}
            submitError={submitError}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-8 py-8">
      <div className="flex justify-center">
        <OnboardingStepIndicator currentStep={store.currentStep} />
      </div>
      {renderStep()}
    </div>
  );
}
