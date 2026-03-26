"use client";

import { ONBOARDING_STEPS } from "../schemas/onboarding.schema";

type OnboardingStepIndicatorProps = {
  currentStep: number;
};

export function OnboardingStepIndicator({
  currentStep,
}: OnboardingStepIndicatorProps) {
  return (
    <nav
      aria-label={`Onboarding progress: step ${currentStep + 1} of ${ONBOARDING_STEPS.length}`}
      className="flex items-center gap-2"
    >
      {ONBOARDING_STEPS.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={step.id} className="flex items-center gap-2">
            <div
              role="listitem"
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`${step.label}${isCompleted ? " (completed)" : isCurrent ? " (current)" : ""}`}
              className={`flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                isCompleted
                  ? "bg-primary text-primary-foreground"
                  : isCurrent
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {isCompleted ? (
                <svg
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            {index < ONBOARDING_STEPS.length - 1 && (
              <div
                aria-hidden="true"
                className={`h-0.5 w-6 transition-colors ${
                  isCompleted ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
