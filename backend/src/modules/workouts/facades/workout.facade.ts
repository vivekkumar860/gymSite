import { Inject, Injectable } from '@nestjs/common';
import { WorkoutPlanFactory } from '../factories/workout-plan.factory';
import { WORKOUT_PLAN_REPOSITORY } from '../interfaces';
import { WorkoutMapper } from '../mappers/workout.mapper';
import type { IWorkoutPlanRepository } from '../interfaces';
import type { GenerateWorkoutPlanDto } from '../dto/generate-workout-plan.dto';
import type { WorkoutPlanResponseDto } from '../dto/workout-response.dto';

/**
 * Facade that orchestrates workout plan generation.
 * Coordinates: factory (blueprint) → deactivate old plans → persist → respond.
 * Keeps the controller thin and generation logic out of the plan service.
 */
@Injectable()
export class WorkoutFacade {
  constructor(
    private readonly planFactory: WorkoutPlanFactory,
    @Inject(WORKOUT_PLAN_REPOSITORY)
    private readonly planRepo: IWorkoutPlanRepository,
  ) {}

  /** Generate a complete workout plan from user inputs. */
  async generatePlan(
    userId: string,
    dto: GenerateWorkoutPlanDto,
  ): Promise<WorkoutPlanResponseDto> {
    const blueprint = await this.planFactory.createPlanBlueprint(dto);
    await this.planRepo.deactivateAllForUser(userId);
    const plan = await this.planRepo.createGeneratedPlan(userId, blueprint);
    return WorkoutMapper.planToResponse(plan);
  }
}
