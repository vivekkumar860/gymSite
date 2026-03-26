/** Emitted when a user completes all onboarding steps. */
export class OnboardingCompletedEvent {
  constructor(
    public readonly userId: string,
    public readonly completedAt: Date,
  ) {}
}
