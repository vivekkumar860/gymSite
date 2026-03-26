import type { GoalDomain, GoalMilestoneDomain } from '../domain/goal';
import type { CreateGoalDto } from '../dto/create-goal.dto';
import type { UpdateGoalDto } from '../dto/update-goal.dto';
import type { CreateMilestoneDto } from '../dto/create-milestone.dto';

/**
 * Contract for goal and milestone data access.
 * Implementations handle Prisma queries and return domain types.
 */
export interface IGoalRepository {
  /** Find a goal by ID. */
  findById(id: string): Promise<GoalDomain | null>;

  /** Find all goals for a user. */
  findByUserId(userId: string): Promise<GoalDomain[]>;

  /** Find active goals for a user. */
  findActiveByUserId(userId: string): Promise<GoalDomain[]>;

  /** Create a new goal. */
  create(userId: string, data: CreateGoalDto): Promise<GoalDomain>;

  /** Update a goal. */
  update(id: string, data: UpdateGoalDto): Promise<GoalDomain>;

  /** Delete a goal. */
  delete(id: string): Promise<void>;

  /** Find milestones for a goal. */
  findMilestones(goalId: string): Promise<GoalMilestoneDomain[]>;

  /** Create a milestone. */
  createMilestone(
    goalId: string,
    data: CreateMilestoneDto,
  ): Promise<GoalMilestoneDomain>;

  /** Mark a milestone as achieved. */
  achieveMilestone(milestoneId: string): Promise<GoalMilestoneDomain>;

  /** Delete a milestone. */
  deleteMilestone(milestoneId: string): Promise<void>;
}

/** DI token for IGoalRepository. */
export const GOAL_REPOSITORY = Symbol('GOAL_REPOSITORY');
