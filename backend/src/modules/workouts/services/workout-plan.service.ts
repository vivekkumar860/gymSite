import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WORKOUT_PLAN_REPOSITORY, WORKOUT_DAY_REPOSITORY } from '../interfaces';
import { WorkoutMapper } from '../mappers/workout.mapper';
import { NotFoundError, AuthorizationError } from '../../../common/errors';
import { DOMAIN_EVENTS } from '../../../common/constants';
import type { IWorkoutPlanRepository } from '../interfaces';
import type { IWorkoutDayRepository } from '../interfaces';
import type { CreateWorkoutPlanDto } from '../dto/create-workout-plan.dto';
import type { UpdateWorkoutPlanDto } from '../dto/update-workout-plan.dto';
import type { CreateWorkoutDayDto } from '../dto/create-workout-day.dto';
import type { AddDayExerciseDto } from '../dto/add-day-exercise.dto';
import type {
  WorkoutPlanResponseDto,
  WorkoutDayResponseDto,
  WorkoutDayDetailResponseDto,
  WorkoutDayExerciseResponseDto,
} from '../dto/workout-response.dto';

/** Business logic for workout plans, days, and day exercises. */
@Injectable()
export class WorkoutPlanService {
  constructor(
    @Inject(WORKOUT_PLAN_REPOSITORY)
    private readonly planRepo: IWorkoutPlanRepository,
    @Inject(WORKOUT_DAY_REPOSITORY)
    private readonly dayRepo: IWorkoutDayRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /** Get all plans for a user. */
  async getUserPlans(userId: string): Promise<WorkoutPlanResponseDto[]> {
    const plans = await this.planRepo.findByUserId(userId);
    return plans.map(WorkoutMapper.planToResponse);
  }

  /** Get the active plan for a user. */
  async getActivePlan(userId: string): Promise<WorkoutPlanResponseDto> {
    const plan = await this.planRepo.findActivePlanByUserId(userId);
    if (!plan) throw new NotFoundError('ActiveWorkoutPlan', userId);
    return WorkoutMapper.planToResponse(plan);
  }

  /** Get a single plan, ensuring ownership. */
  async getPlanById(
    planId: string,
    userId: string,
  ): Promise<WorkoutPlanResponseDto> {
    const plan = await this.findPlanOrFail(planId);
    this.ensureOwnership(plan.userId, userId);
    return WorkoutMapper.planToResponse(plan);
  }

  /** Get a day with all its exercises (detail view). */
  async getDayDetail(
    dayId: string,
    userId: string,
  ): Promise<WorkoutDayDetailResponseDto> {
    const detail = await this.dayRepo.findByIdWithExercises(dayId);
    if (!detail) throw new NotFoundError('WorkoutDay', dayId);

    const plan = await this.findPlanOrFail(detail.planId);
    this.ensureOwnership(plan.userId, userId);

    return WorkoutMapper.dayDetailToResponse(detail);
  }

  /** Reschedule a missed workout day. */
  async rescheduleDay(
    dayId: string,
    userId: string,
    newDate: Date,
  ): Promise<WorkoutDayResponseDto> {
    const day = await this.findDayOrFail(dayId);
    const plan = await this.findPlanOrFail(day.planId);
    this.ensureOwnership(plan.userId, userId);

    const updated = await this.dayRepo.reschedule(dayId, newDate);
    return WorkoutMapper.dayToResponse(updated);
  }

  /** Create a new workout plan. */
  async createPlan(
    userId: string,
    dto: CreateWorkoutPlanDto,
  ): Promise<WorkoutPlanResponseDto> {
    const plan = await this.planRepo.create(userId, dto);

    this.eventEmitter.emit(DOMAIN_EVENTS.WORKOUT_PLAN_CREATED, {
      userId,
      planId: plan.id,
    });

    return WorkoutMapper.planToResponse(plan);
  }

  /** Update a workout plan. */
  async updatePlan(
    planId: string,
    userId: string,
    dto: UpdateWorkoutPlanDto,
  ): Promise<WorkoutPlanResponseDto> {
    const plan = await this.findPlanOrFail(planId);
    this.ensureOwnership(plan.userId, userId);

    const updated = await this.planRepo.update(planId, dto);
    return WorkoutMapper.planToResponse(updated);
  }

  /** Delete a workout plan. */
  async deletePlan(planId: string, userId: string): Promise<void> {
    const plan = await this.findPlanOrFail(planId);
    this.ensureOwnership(plan.userId, userId);
    await this.planRepo.delete(planId);
  }

  /** Get all days for a plan. */
  async getPlanDays(
    planId: string,
    userId: string,
  ): Promise<WorkoutDayResponseDto[]> {
    const plan = await this.findPlanOrFail(planId);
    this.ensureOwnership(plan.userId, userId);

    const days = await this.dayRepo.findByPlanId(planId);
    return days.map(WorkoutMapper.dayToResponse);
  }

  /** Add a day to a plan. */
  async addDay(
    planId: string,
    userId: string,
    dto: CreateWorkoutDayDto,
  ): Promise<WorkoutDayResponseDto> {
    const plan = await this.findPlanOrFail(planId);
    this.ensureOwnership(plan.userId, userId);

    const day = await this.dayRepo.create(planId, dto);
    return WorkoutMapper.dayToResponse(day);
  }

  /** Remove a day from a plan. */
  async removeDay(dayId: string, userId: string): Promise<void> {
    const day = await this.findDayOrFail(dayId);
    const plan = await this.findPlanOrFail(day.planId);
    this.ensureOwnership(plan.userId, userId);
    await this.dayRepo.delete(dayId);
  }

  /** Get exercises for a day. */
  async getDayExercises(
    dayId: string,
    userId: string,
  ): Promise<WorkoutDayExerciseResponseDto[]> {
    const day = await this.findDayOrFail(dayId);
    const plan = await this.findPlanOrFail(day.planId);
    this.ensureOwnership(plan.userId, userId);

    const exercises = await this.dayRepo.findExercisesByDayId(dayId);
    return exercises.map(WorkoutMapper.dayExerciseToResponse);
  }

  /** Add an exercise to a day. */
  async addExerciseToDay(
    dayId: string,
    userId: string,
    dto: AddDayExerciseDto,
  ): Promise<WorkoutDayExerciseResponseDto> {
    const day = await this.findDayOrFail(dayId);
    const plan = await this.findPlanOrFail(day.planId);
    this.ensureOwnership(plan.userId, userId);

    const entry = await this.dayRepo.addExercise(dayId, dto);
    return WorkoutMapper.dayExerciseToResponse(entry);
  }

  /** Remove an exercise from a day. */
  async removeExerciseFromDay(
    exerciseEntryId: string,
    dayId: string,
    userId: string,
  ): Promise<void> {
    const day = await this.findDayOrFail(dayId);
    const plan = await this.findPlanOrFail(day.planId);
    this.ensureOwnership(plan.userId, userId);
    await this.dayRepo.removeExercise(exerciseEntryId);
  }

  // ── Private helpers ──────────────────────────────────────────

  private async findPlanOrFail(planId: string) {
    const plan = await this.planRepo.findById(planId);
    if (!plan) throw new NotFoundError('WorkoutPlan', planId);
    return plan;
  }

  private async findDayOrFail(dayId: string) {
    const day = await this.dayRepo.findById(dayId);
    if (!day) throw new NotFoundError('WorkoutDay', dayId);
    return day;
  }

  private ensureOwnership(ownerId: string, requesterId: string): void {
    if (ownerId !== requesterId) {
      throw new AuthorizationError('You do not own this resource');
    }
  }
}
