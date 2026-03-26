import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { GoalDomain, GoalMilestoneDomain } from '../domain/goal';
import { GoalMapper } from '../mappers/goal.mapper';
import type { IGoalRepository } from '../interfaces';
import type { CreateGoalDto } from '../dto/create-goal.dto';
import type { UpdateGoalDto } from '../dto/update-goal.dto';
import type { CreateMilestoneDto } from '../dto/create-milestone.dto';

/** Prisma-backed implementation of the goal repository contract. */
@Injectable()
export class GoalRepository implements IGoalRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Find a goal by ID. */
  async findById(id: string): Promise<GoalDomain | null> {
    const record = await this.prisma.goal.findUnique({ where: { id } });
    if (!record) return null;
    return GoalMapper.toDomain(record);
  }

  /** Find all goals for a user. */
  async findByUserId(userId: string): Promise<GoalDomain[]> {
    const records = await this.prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(GoalMapper.toDomain);
  }

  /** Find active goals for a user. */
  async findActiveByUserId(userId: string): Promise<GoalDomain[]> {
    const records = await this.prisma.goal.findMany({
      where: { userId, goalStatus: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(GoalMapper.toDomain);
  }

  /** Create a new goal. */
  async create(userId: string, data: CreateGoalDto): Promise<GoalDomain> {
    const record = await this.prisma.goal.create({
      data: {
        userId,
        goalType: data.goalType as any,
        title: data.title,
        description: data.description,
        targetValue: data.targetValue,
        targetUnit: data.targetUnit,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
      },
    });
    return GoalMapper.toDomain(record);
  }

  /** Update a goal. */
  async update(id: string, data: UpdateGoalDto): Promise<GoalDomain> {
    const updateData: Record<string, unknown> = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.targetValue !== undefined)
      updateData.targetValue = data.targetValue;
    if (data.currentValue !== undefined)
      updateData.currentValue = data.currentValue;
    if (data.goalStatus !== undefined) updateData.goalStatus = data.goalStatus;
    if (data.deadline !== undefined)
      updateData.deadline = new Date(data.deadline);

    const record = await this.prisma.goal.update({
      where: { id },
      data: updateData,
    });
    return GoalMapper.toDomain(record);
  }

  /** Delete a goal. */
  async delete(id: string): Promise<void> {
    await this.prisma.goal.delete({ where: { id } });
  }

  /** Find milestones for a goal. */
  async findMilestones(goalId: string): Promise<GoalMilestoneDomain[]> {
    const records = await this.prisma.goalMilestone.findMany({
      where: { goalId },
      orderBy: { milestoneOrder: 'asc' },
    });
    return records.map(GoalMapper.milestoneToDomain);
  }

  /** Create a milestone. */
  async createMilestone(
    goalId: string,
    data: CreateMilestoneDto,
  ): Promise<GoalMilestoneDomain> {
    const record = await this.prisma.goalMilestone.create({
      data: { ...data, goalId },
    });
    return GoalMapper.milestoneToDomain(record);
  }

  /** Mark a milestone as achieved. */
  async achieveMilestone(milestoneId: string): Promise<GoalMilestoneDomain> {
    const record = await this.prisma.goalMilestone.update({
      where: { id: milestoneId },
      data: { isAchieved: true, achievedAt: new Date() },
    });
    return GoalMapper.milestoneToDomain(record);
  }

  /** Delete a milestone. */
  async deleteMilestone(milestoneId: string): Promise<void> {
    await this.prisma.goalMilestone.delete({ where: { id: milestoneId } });
  }
}
