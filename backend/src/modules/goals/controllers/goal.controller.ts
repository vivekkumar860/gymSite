import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GoalService } from '../services/goal.service';
import { ZodValidationPipe } from '../../../common/pipes';
import { JwtAuthGuard } from '../../../common/guards';
import { CurrentUser } from '../../../common/decorators';
import { CreateGoalSchema } from '../dto/create-goal.dto';
import { UpdateGoalSchema } from '../dto/update-goal.dto';
import { CreateMilestoneSchema } from '../dto/create-milestone.dto';
import type { CreateGoalDto } from '../dto/create-goal.dto';
import type { UpdateGoalDto } from '../dto/update-goal.dto';
import type { CreateMilestoneDto } from '../dto/create-milestone.dto';
import type {
  GoalResponseDto,
  MilestoneResponseDto,
} from '../dto/goal-response.dto';

/** Handles goal and milestone endpoints. */
@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  /** List all goals for the user. */
  @Get()
  async listGoals(@CurrentUser() userId: string): Promise<GoalResponseDto[]> {
    return this.goalService.getUserGoals(userId);
  }

  /** Get a single goal. */
  @Get(':goalId')
  async getGoal(
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @CurrentUser() userId: string,
  ): Promise<GoalResponseDto> {
    return this.goalService.getGoalById(goalId, userId);
  }

  /** Create a new goal. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createGoal(
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(CreateGoalSchema)) dto: CreateGoalDto,
  ): Promise<GoalResponseDto> {
    return this.goalService.createGoal(userId, dto);
  }

  /** Update a goal. */
  @Patch(':goalId')
  async updateGoal(
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(UpdateGoalSchema)) dto: UpdateGoalDto,
  ): Promise<GoalResponseDto> {
    return this.goalService.updateGoal(goalId, userId, dto);
  }

  /** Delete a goal. */
  @Delete(':goalId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteGoal(
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.goalService.deleteGoal(goalId, userId);
  }

  /** List milestones for a goal. */
  @Get(':goalId/milestones')
  async listMilestones(
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @CurrentUser() userId: string,
  ): Promise<MilestoneResponseDto[]> {
    return this.goalService.getGoalMilestones(goalId, userId);
  }

  /** Add a milestone to a goal. */
  @Post(':goalId/milestones')
  @HttpCode(HttpStatus.CREATED)
  async addMilestone(
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(CreateMilestoneSchema)) dto: CreateMilestoneDto,
  ): Promise<MilestoneResponseDto> {
    return this.goalService.addMilestone(goalId, userId, dto);
  }

  /** Mark a milestone as achieved. */
  @Post(':goalId/milestones/:milestoneId/achieve')
  async achieveMilestone(
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @Param('milestoneId', ParseUUIDPipe) milestoneId: string,
    @CurrentUser() userId: string,
  ): Promise<MilestoneResponseDto> {
    return this.goalService.achieveMilestone(milestoneId, goalId, userId);
  }

  /** Delete a milestone. */
  @Delete(':goalId/milestones/:milestoneId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMilestone(
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @Param('milestoneId', ParseUUIDPipe) milestoneId: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.goalService.deleteMilestone(milestoneId, goalId, userId);
  }
}
