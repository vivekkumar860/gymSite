"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { OnboardingFormData } from "../schemas/onboarding.schema";
import { ONBOARDING_STEPS } from "../schemas/onboarding.schema";

const STORAGE_KEY = "onboarding-progress";

type OnboardingState = {
  currentStep: number;
  formData: Partial<OnboardingFormData>;
};

function loadFromStorage(): OnboardingState {
  if (typeof window === "undefined") {
    return { currentStep: 0, formData: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as OnboardingState;
      if (
        typeof parsed.currentStep === "number" &&
        parsed.currentStep >= 0 &&
        parsed.currentStep < ONBOARDING_STEPS.length
      ) {
        return parsed;
      }
    }
  } catch {
    // corrupted storage — start fresh
  }
  return { currentStep: 0, formData: {} };
}

function saveToStorage(state: OnboardingState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable — silently fail
  }
}

export function clearOnboardingStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}

export function useOnboardingStore() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<OnboardingFormData>>({});
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      const saved = loadFromStorage();
      setCurrentStep(saved.currentStep);
      setFormData(saved.formData);
      hydrated.current = true;
    }
  }, []);

  const persist = useCallback(
    (step: number, data: Partial<OnboardingFormData>) => {
      saveToStorage({ currentStep: step, formData: data });
    },
    [],
  );

  const mergeStepData = useCallback(
    (stepData: Partial<OnboardingFormData>) => {
      setFormData((prev) => {
        const next = { ...prev, ...stepData };
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        persist(nextStep, next);
        return next;
      });
    },
    [currentStep, persist],
  );

  const goBack = useCallback(() => {
    setCurrentStep((prev) => {
      const next = Math.max(0, prev - 1);
      persist(next, formData);
      return next;
    });
  }, [formData, persist]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < ONBOARDING_STEPS.length) {
        setCurrentStep(step);
        persist(step, formData);
      }
    },
    [formData, persist],
  );

  const reset = useCallback(() => {
    setCurrentStep(0);
    setFormData({});
    clearOnboardingStorage();
  }, []);

  return {
    currentStep,
    formData,
    totalSteps: ONBOARDING_STEPS.length,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === ONBOARDING_STEPS.length - 1,
    isSummaryStep: currentStep === ONBOARDING_STEPS.length - 1,
    mergeStepData,
    goBack,
    goToStep,
    reset,
  };
}
