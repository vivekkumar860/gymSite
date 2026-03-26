import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { WorkoutMapper } from '../mappers/workout.mapper';
import type { IWorkoutPlanRepository, GeneratedPlanData } from '../interfaces';
import type { WorkoutPlanDomain } from '../domain/workout';
import type { CreateWorkoutPlanDto } from '../dto/create-workout-plan.dto';
import type { UpdateWorkoutPlanDto } from '../dto/update-workout-plan.dto';

/** Prisma-backed implementation of the workout plan repository. */
@Injectable()
export class WorkoutPlanRepository implements IWorkoutPlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Find a plan by ID. */
  async findById(id: string): Promise<WorkoutPlanDomain | null> {
    const record = await this.prisma.workoutPlan.findUnique({ where: { id } });
    if (!record) return null;
    return WorkoutMapper.planToDomain(record);
  }

  /** Find all plans for a user. */
  async findByUserId(userId: string): Promise<WorkoutPlanDomain[]> {
    const records = await this.prisma.workoutPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(WorkoutMapper.planToDomain);
  }

  /** Find the active plan for a user. */
  async findActivePlanByUserId(
    userId: string,
  ): Promise<WorkoutPlanDomain | null> {
    const record = await this.prisma.workoutPlan.findFirst({
      where: { userId, planStatus: 'ACTIVE' },
      orderBy: { updatedAt: 'desc' },
    });
    if (!record) return null;
    return WorkoutMapper.planToDomain(record);
  }

  /** Create a manual workout plan. */
  async create(
    userId: string,
    data: CreateWorkoutPlanDto,
  ): Promise<WorkoutPlanDomain> {
    const record = await this.prisma.workoutPlan.create({
      data: { ...data, userId },
    });
    return WorkoutMapper.planToDomain(record);
  }

  /** Create a generated plan with all days and exercises in a single transaction. */
  async createGeneratedPlan(
    userId: string,
    data: GeneratedPlanData,
  ): Promise<WorkoutPlanDomain> {
    const record = await this.prisma.workoutPlan.create({
      data: {
        userId,
        planName: data.planName,
        description: data.description,
        daysPerWeek: data.daysPerWeek,
        durationWeeks: data.durationWeeks,
        planStatus: 'ACTIVE',
        workoutDays: {
          create: data.days.map((day) => ({
            dayName: day.dayName,
            dayOrder: day.dayOrder,
            focusArea: day.focusArea,
            scheduledDate: day.scheduledDate,
            exercises: {
              create: day.exercises.map((ex) => ({
                exerciseId: ex.exerciseId,
                exerciseOrder: ex.exerciseOrder,
                targetSets: ex.targetSets,
                targetRepsMin: ex.targetRepsMin,
                targetRepsMax: ex.targetRepsMax,
                restSeconds: ex.restSeconds,
              })),
            },
          })),
        },
      },
    });
    return WorkoutMapper.planToDomain(record);
  }

  /** Deactivate all plans for a user. */
  async deactivateAllForUser(userId: string): Promise<void> {
    await this.prisma.workoutPlan.updateMany({
      where: { userId, planStatus: 'ACTIVE' },
      data: { planStatus: 'PAUSED' },
    });
  }

  /** Update a workout plan. */
  async update(
    id: string,
    data: UpdateWorkoutPlanDto,
  ): Promise<WorkoutPlanDomain> {
    const record = await this.prisma.workoutPlan.update({
      where: { id },
      data,
    });
    return WorkoutMapper.planToDomain(record);
  }

  /** Delete a workout plan. */
  async delete(id: string): Promise<void> {
    await this.prisma.workoutPlan.delete({ where: { id } });
  }
}
