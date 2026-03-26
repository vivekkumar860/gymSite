import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { WorkoutMapper } from '../mappers/workout.mapper';
import type { IWorkoutDayRepository } from '../interfaces';
import type {
  WorkoutDayDomain,
  WorkoutDayDetailDomain,
  WorkoutDayExerciseDomain,
} from '../domain/workout';
import type { CreateWorkoutDayDto } from '../dto/create-workout-day.dto';
import type { AddDayExerciseDto } from '../dto/add-day-exercise.dto';

/** Prisma-backed implementation of the workout day repository. */
@Injectable()
export class WorkoutDayRepository implements IWorkoutDayRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Find a day by ID. */
  async findById(id: string): Promise<WorkoutDayDomain | null> {
    const record = await this.prisma.workoutDay.findUnique({ where: { id } });
    if (!record) return null;
    return WorkoutMapper.dayToDomain(record);
  }

  /** Find a day by ID with its exercises (joined with exercise names). */
  async findByIdWithExercises(
    id: string,
  ): Promise<WorkoutDayDetailDomain | null> {
    const record = await this.prisma.workoutDay.findUnique({
      where: { id },
      include: {
        exercises: {
          orderBy: { exerciseOrder: 'asc' },
          include: { exercise: { select: { exerciseName: true } } },
        },
      },
    });
    if (!record) return null;
    return WorkoutMapper.dayDetailToDomain(record);
  }

  /** Find all days for a plan, ordered. */
  async findByPlanId(planId: string): Promise<WorkoutDayDomain[]> {
    const records = await this.prisma.workoutDay.findMany({
      where: { planId },
      orderBy: { dayOrder: 'asc' },
    });
    return records.map(WorkoutMapper.dayToDomain);
  }

  /** Create a workout day. */
  async create(
    planId: string,
    data: CreateWorkoutDayDto,
  ): Promise<WorkoutDayDomain> {
    const record = await this.prisma.workoutDay.create({
      data: { ...data, planId },
    });
    return WorkoutMapper.dayToDomain(record);
  }

  /** Delete a workout day. */
  async delete(id: string): Promise<void> {
    await this.prisma.workoutDay.delete({ where: { id } });
  }

  /** Reschedule a day to a new date. */
  async reschedule(dayId: string, newDate: Date): Promise<WorkoutDayDomain> {
    const record = await this.prisma.workoutDay.update({
      where: { id: dayId },
      data: { scheduledDate: newDate },
    });
    return WorkoutMapper.dayToDomain(record);
  }

  /** Find all exercises for a day, ordered (with exercise names). */
  async findExercisesByDayId(
    dayId: string,
  ): Promise<WorkoutDayExerciseDomain[]> {
    const records = await this.prisma.workoutDayExercise.findMany({
      where: { dayId },
      orderBy: { exerciseOrder: 'asc' },
      include: { exercise: { select: { exerciseName: true } } },
    });
    return records.map(WorkoutMapper.dayExerciseToDomain);
  }

  /** Add an exercise to a day. */
  async addExercise(
    dayId: string,
    data: AddDayExerciseDto,
  ): Promise<WorkoutDayExerciseDomain> {
    const record = await this.prisma.workoutDayExercise.create({
      data: { ...data, dayId },
    });
    return WorkoutMapper.dayExerciseToDomain(record);
  }

  /** Remove an exercise from a day. */
  async removeExercise(exerciseEntryId: string): Promise<void> {
    await this.prisma.workoutDayExercise.delete({
      where: { id: exerciseEntryId },
    });
  }
}
