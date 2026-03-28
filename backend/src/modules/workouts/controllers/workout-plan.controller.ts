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
import { WorkoutPlanService } from '../services/workout-plan.service';
import { WorkoutFacade } from '../facades/workout.facade';
import { ZodValidationPipe } from '../../../common/pipes';
import { JwtAuthGuard } from '../../../common/guards';
import { CurrentUser } from '../../../common/decorators';
import { CreateWorkoutPlanSchema } from '../dto/create-workout-plan.dto';
import { UpdateWorkoutPlanSchema } from '../dto/update-workout-plan.dto';
import { CreateWorkoutDaySchema } from '../dto/create-workout-day.dto';
import { AddDayExerciseSchema } from '../dto/add-day-exercise.dto';
import { GenerateWorkoutPlanSchema } from '../dto/generate-workout-plan.dto';
import { RescheduleDaySchema } from '../dto/reschedule-day.dto';
import type { GenerateWorkoutPlanDto } from '../dto/generate-workout-plan.dto';
import type { RescheduleDayDto } from '../dto/reschedule-day.dto';
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

/** Handles workout plan, generation, day, and day-exercise endpoints. */
@Controller('workout-plans')
@UseGuards(JwtAuthGuard)
export class WorkoutPlanController {
  constructor(
    private readonly planService: WorkoutPlanService,
    private readonly workoutFacade: WorkoutFacade,
  ) {}

  // ── Static / non-parameterised paths FIRST ────────────────────

  /** Generate a workout plan from user inputs. */
  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  async generate(
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(GenerateWorkoutPlanSchema))
    dto: GenerateWorkoutPlanDto,
  ): Promise<WorkoutPlanResponseDto> {
    return this.workoutFacade.generatePlan(userId, dto);
  }

  /** Get the currently active workout plan. */
  @Get('active')
  async getActivePlan(
    @CurrentUser() userId: string,
  ): Promise<WorkoutPlanResponseDto> {
    return this.planService.getActivePlan(userId);
  }

  /** List all workout plans for the authenticated user. */
  @Get()
  async listPlans(
    @CurrentUser() userId: string,
  ): Promise<WorkoutPlanResponseDto[]> {
    return this.planService.getUserPlans(userId);
  }

  // ── Day sub-resource routes (before :planId catch-all) ────────

  /** Get a workout day with all its exercises (detail view). */
  @Get('days/:dayId')
  async getDayDetail(
    @Param('dayId', ParseUUIDPipe) dayId: string,
    @CurrentUser() userId: string,
  ): Promise<WorkoutDayDetailResponseDto> {
    return this.planService.getDayDetail(dayId, userId);
  }

  /** Reschedule a missed workout day. */
  @Patch('days/:dayId/reschedule')
  async rescheduleDay(
    @Param('dayId', ParseUUIDPipe) dayId: string,
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(RescheduleDaySchema)) dto: RescheduleDayDto,
  ): Promise<WorkoutDayResponseDto> {
    return this.planService.rescheduleDay(dayId, userId, dto.newDate);
  }

  /** Delete a day from a workout plan. */
  @Delete('days/:dayId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeDay(
    @Param('dayId', ParseUUIDPipe) dayId: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.planService.removeDay(dayId, userId);
  }

  /** List exercises in a workout day. */
  @Get('days/:dayId/exercises')
  async listDayExercises(
    @Param('dayId', ParseUUIDPipe) dayId: string,
    @CurrentUser() userId: string,
  ): Promise<WorkoutDayExerciseResponseDto[]> {
    return this.planService.getDayExercises(dayId, userId);
  }

  /** Add an exercise to a workout day. */
  @Post('days/:dayId/exercises')
  @HttpCode(HttpStatus.CREATED)
  async addExercise(
    @Param('dayId', ParseUUIDPipe) dayId: string,
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(AddDayExerciseSchema)) dto: AddDayExerciseDto,
  ): Promise<WorkoutDayExerciseResponseDto> {
    return this.planService.addExerciseToDay(dayId, userId, dto);
  }

  /** Remove an exercise from a workout day. */
  @Delete('days/:dayId/exercises/:exerciseEntryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeExercise(
    @Param('dayId', ParseUUIDPipe) dayId: string,
    @Param('exerciseEntryId', ParseUUIDPipe) exerciseEntryId: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.planService.removeExerciseFromDay(
      exerciseEntryId,
      dayId,
      userId,
    );
  }

  // ── Plan :planId routes (catch-all parameter LAST) ────────────

  /** Get a single workout plan. */
  @Get(':planId')
  async getPlan(
    @Param('planId', ParseUUIDPipe) planId: string,
    @CurrentUser() userId: string,
  ): Promise<WorkoutPlanResponseDto> {
    return this.planService.getPlanById(planId, userId);
  }

  /** Create a new workout plan manually. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPlan(
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(CreateWorkoutPlanSchema))
    dto: CreateWorkoutPlanDto,
  ): Promise<WorkoutPlanResponseDto> {
    return this.planService.createPlan(userId, dto);
  }

  /** Update a workout plan. */
  @Patch(':planId')
  async updatePlan(
    @Param('planId', ParseUUIDPipe) planId: string,
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(UpdateWorkoutPlanSchema))
    dto: UpdateWorkoutPlanDto,
  ): Promise<WorkoutPlanResponseDto> {
    return this.planService.updatePlan(planId, userId, dto);
  }

  /** Delete a workout plan. */
  @Delete(':planId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePlan(
    @Param('planId', ParseUUIDPipe) planId: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.planService.deletePlan(planId, userId);
  }

  /** List days in a workout plan. */
  @Get(':planId/days')
  async listDays(
    @Param('planId', ParseUUIDPipe) planId: string,
    @CurrentUser() userId: string,
  ): Promise<WorkoutDayResponseDto[]> {
    return this.planService.getPlanDays(planId, userId);
  }

  /** Add a day to a workout plan. */
  @Post(':planId/days')
  @HttpCode(HttpStatus.CREATED)
  async addDay(
    @Param('planId', ParseUUIDPipe) planId: string,
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(CreateWorkoutDaySchema))
    dto: CreateWorkoutDayDto,
  ): Promise<WorkoutDayResponseDto> {
    return this.planService.addDay(planId, userId, dto);
  }
}
