import { Goal, GoalMilestone } from '@prisma/client';
import { GoalDomain, GoalMilestoneDomain } from '../domain/goal';
import {
  GoalResponseDto,
  MilestoneResponseDto,
} from '../dto/goal-response.dto';

/** Maps between Prisma goal models, domain types, and response DTOs. */
export class GoalMapper {
  static toDomain(record: Goal): GoalDomain {
    return {
      id: record.id,
      userId: record.userId,
      goalType: record.goalType,
      title: record.title,
      description: record.description,
      targetValue: record.targetValue ? Number(record.targetValue) : null,
      targetUnit: record.targetUnit,
      currentValue: record.currentValue ? Number(record.currentValue) : null,
      deadline: record.deadline,
      goalStatus: record.goalStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  static toResponse(domain: GoalDomain): GoalResponseDto {
    return {
      id: domain.id,
      goalType: domain.goalType,
      title: domain.title,
      description: domain.description,
      targetValue: domain.targetValue,
      targetUnit: domain.targetUnit,
      currentValue: domain.currentValue,
      deadline: domain.deadline?.toISOString().split('T')[0] ?? null,
      goalStatus: domain.goalStatus,
      progressPct: this.calculateProgress(
        domain.currentValue,
        domain.targetValue,
      ),
      createdAt: domain.createdAt.toISOString(),
    };
  }

  static milestoneToDomain(record: GoalMilestone): GoalMilestoneDomain {
    return {
      id: record.id,
      goalId: record.goalId,
      title: record.title,
      targetValue: record.targetValue ? Number(record.targetValue) : null,
      milestoneOrder: record.milestoneOrder,
      isAchieved: record.isAchieved,
      achievedAt: record.achievedAt,
    };
  }

  static milestoneToResponse(
    domain: GoalMilestoneDomain,
  ): MilestoneResponseDto {
    return {
      id: domain.id,
      title: domain.title,
      targetValue: domain.targetValue,
      milestoneOrder: domain.milestoneOrder,
      isAchieved: domain.isAchieved,
      achievedAt: domain.achievedAt?.toISOString() ?? null,
    };
  }

  private static calculateProgress(
    current: number | null,
    target: number | null,
  ): number {
    if (!target || target === 0) return 0;
    if (!current) return 0;

    const pct = Math.round((current / target) * 100);
    return Math.min(pct, 100);
  }
}
