import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OnboardingRepository } from '../repositories/onboarding.repository';
import { OnboardingCompletedEvent } from '../events/onboarding-completed.event';
import { DOMAIN_EVENTS } from '../../../common/constants';
import { TOTAL_ONBOARDING_STEPS } from '../dto/complete-step.dto';
import type { OnboardingResponseDto } from '../dto/onboarding-response.dto';

/** Business logic for user onboarding flow. */
@Injectable()
export class OnboardingService {
  constructor(
    private readonly onboardingRepo: OnboardingRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /** Get the current onboarding status for a user. */
  async getStatus(userId: string): Promise<OnboardingResponseDto> {
    const completedSteps = await this.onboardingRepo.findCompletedSteps(userId);

    return {
      userId,
      completedSteps,
      totalSteps: TOTAL_ONBOARDING_STEPS,
      isComplete: completedSteps.length >= TOTAL_ONBOARDING_STEPS,
    };
  }

  /** Mark a step as completed and emit event if this step completed onboarding. */
  async completeStep(
    userId: string,
    step: string,
  ): Promise<OnboardingResponseDto> {
    const before = await this.getStatus(userId);
    await this.onboardingRepo.completeStep(userId, step);
    const after = await this.getStatus(userId);

    const justCompleted = !before.isComplete && after.isComplete;
    if (justCompleted) {
      this.eventEmitter.emit(
        DOMAIN_EVENTS.ONBOARDING_COMPLETED,
        new OnboardingCompletedEvent(userId, new Date()),
      );
    }

    return after;
  }
}
