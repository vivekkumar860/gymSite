import type { Metadata } from "next";
import { OnboardingFlow } from "@/features/onboarding";

export const metadata: Metadata = {
  title: "Get Started - FitTrack",
};

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
