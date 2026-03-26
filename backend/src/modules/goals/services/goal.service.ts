import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GOAL_REPOSITORY } from '../interfaces';
import type { IGoalRepository } from '../interfaces';
import { GoalMapper } from '../mappers/goal.mapper';
import { resolveGoalStrategy } from '../strategies/goal-evaluation.strategy';
import { GoalAchievedEvent } from '../events/goal-achieved.event';
import { NotFoundError, AuthorizationError } from '../../../common/errors';
import { DOMAIN_EVENTS } from '../../../common/constants';
import type { GoalDomain } from '../domain/goal';
import type { CreateGoalDto } from '../dto/create-goal.dto';
import type { UpdateGoalDto } from '../dto/update-goal.dto';
import type { CreateMilestoneDto } from '../dto/create-milestone.dto';
import type {
  GoalResponseDto,
  MilestoneResponseDto,
} from '../dto/goal-response.dto';

/** Business logic for goals and milestones. */
@Injectable()
export class GoalService {
  constructor(
    @Inject(GOAL_REPOSITORY) private readonly goalRepo: IGoalRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /** Get all goals for a user. */
  async getUserGoals(userId: string): Promise<GoalResponseDto[]> {
    const goals = await this.goalRepo.findByUserId(userId);
    return goals.map(GoalMapper.toResponse);
  }

  /** Get a single goal. */
  async getGoalById(goalId: string, userId: string): Promise<GoalResponseDto> {
    const goal = await this.findGoalOrFail(goalId);
    this.ensureOwnership(goal.userId, userId);
    return GoalMapper.toResponse(goal);
  }

  /** Create a new goal. */
  async createGoal(
    userId: string,
    dto: CreateGoalDto,
  ): Promise<GoalResponseDto> {
    const goal = await this.goalRepo.create(userId, dto);
    return GoalMapper.toResponse(goal);
  }

  /** Update a goal and evaluate if it's been achieved. */
  async updateGoal(
    goalId: string,
    userId: string,
    dto: UpdateGoalDto,
  ): Promise<GoalResponseDto> {
    const goal = await this.findGoalOrFail(goalId);
    this.ensureOwnership(goal.userId, userId);

    const updated = await this.goalRepo.update(goalId, dto);
    await this.evaluateGoalAchievement(updated);

    const fresh = await this.goalRepo.findById(goalId);
    return GoalMapper.toResponse(fresh!);
  }

  /** Delete a goal. */
  async deleteGoal(goalId: string, userId: string): Promise<void> {
    const goal = await this.findGoalOrFail(goalId);
    this.ensureOwnership(goal.userId, userId);
    await this.goalRepo.delete(goalId);
  }

  /** Get milestones for a goal. */
  async getGoalMilestones(
    goalId: string,
    userId: string,
  ): Promise<MilestoneResponseDto[]> {
    const goal = await this.findGoalOrFail(goalId);
    this.ensureOwnership(goal.userId, userId);

    const milestones = await this.goalRepo.findMilestones(goalId);
    return milestones.map(GoalMapper.milestoneToResponse);
  }

  /** Add a milestone to a goal. */
  async addMilestone(
    goalId: string,
    userId: string,
    dto: CreateMilestoneDto,
  ): Promise<MilestoneResponseDto> {
    const goal = await this.findGoalOrFail(goalId);
    this.ensureOwnership(goal.userId, userId);

    const milestone = await this.goalRepo.createMilestone(goalId, dto);
    return GoalMapper.milestoneToResponse(milestone);
  }

  /** Mark a milestone as achieved. */
  async achieveMilestone(
    milestoneId: string,
    goalId: string,
    userId: string,
  ): Promise<MilestoneResponseDto> {
    const goal = await this.findGoalOrFail(goalId);
    this.ensureOwnership(goal.userId, userId);

    const milestone = await this.goalRepo.achieveMilestone(milestoneId);
    return GoalMapper.milestoneToResponse(milestone);
  }

  /** Delete a milestone. */
  async deleteMilestone(
    milestoneId: string,
    goalId: string,
    userId: string,
  ): Promise<void> {
    const goal = await this.findGoalOrFail(goalId);
    this.ensureOwnership(goal.userId, userId);
    await this.goalRepo.deleteMilestone(milestoneId);
  }

  // ── Private helpers ──────────────────────────────────────────

  private async evaluateGoalAchievement(goal: GoalDomain): Promise<void> {
    if (goal.goalStatus !== 'ACTIVE') return;

    const strategy = resolveGoalStrategy(goal.goalType);
    const isAchieved = strategy.isAchieved(goal);

    if (!isAchieved) return;

    await this.goalRepo.update(goal.id, { goalStatus: 'ACHIEVED' });

    this.eventEmitter.emit(
      DOMAIN_EVENTS.GOAL_ACHIEVED,
      new GoalAchievedEvent(goal.userId, goal.id, goal.goalType, new Date()),
    );
  }

  private async findGoalOrFail(goalId: string) {
    const goal = await this.goalRepo.findById(goalId);
    if (!goal) throw new NotFoundError('Goal', goalId);
    return goal;
  }

  private ensureOwnership(ownerId: string, requesterId: string): void {
    if (ownerId !== requesterId) {
      throw new AuthorizationError('You do not own this resource');
    }
  }
}
