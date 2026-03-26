import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

/** Data access for onboarding step completions. */
@Injectable()
export class OnboardingRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Get all completed step names for a user. */
  async findCompletedSteps(userId: string): Promise<string[]> {
    const records = await this.prisma.onboardingCompletion.findMany({
      where: { userId },
      select: { step: true },
      orderBy: { completedAt: 'asc' },
    });

    return records.map((r) => r.step);
  }

  /** Mark a step as completed. Idempotent via unique constraint. */
  async completeStep(userId: string, step: string): Promise<void> {
    await this.prisma.onboardingCompletion.upsert({
      where: { uq_onboarding_user_step: { userId, step: step as any } },
      create: { userId, step: step as any },
      update: {},
    });
  }
}
