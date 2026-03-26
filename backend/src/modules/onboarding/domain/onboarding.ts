/** Domain representation of a user's onboarding status. */
export interface OnboardingStatus {
  userId: string;
  completedSteps: string[];
  isComplete: boolean;
}
