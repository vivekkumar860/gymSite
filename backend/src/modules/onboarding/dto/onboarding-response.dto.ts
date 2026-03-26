/** Shape of the onboarding status response. */
export interface OnboardingResponseDto {
  userId: string;
  completedSteps: string[];
  totalSteps: number;
  isComplete: boolean;
}
