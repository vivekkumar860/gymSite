"use client";

import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type StepLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  nextLabel?: string;
  nextDisabled?: boolean;
};

export function StepLayout({
  title,
  description,
  children,
  onNext,
  onBack,
  isFirstStep = false,
  isLastStep = false,
  isSubmitting = false,
  nextLabel,
  nextDisabled = false,
}: StepLayoutProps) {
  const resolvedNextLabel =
    nextLabel ?? (isLastStep ? "Complete Setup" : "Continue");

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6 py-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isFirstStep}
          aria-label="Go to previous step"
        >
          Back
        </Button>

        <Button
          type={onNext ? "button" : "submit"}
          onClick={onNext}
          disabled={isSubmitting || nextDisabled}
          aria-label={resolvedNextLabel}
        >
          {isSubmitting ? "Saving..." : resolvedNextLabel}
        </Button>
      </div>
    </div>
  );
}
