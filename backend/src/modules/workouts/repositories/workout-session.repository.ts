import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { WorkoutMapper } from '../mappers/workout.mapper';
import {
  WeightedVolumeStrategy,
  type SetData,
} from '../strategies/volume-calculator.strategy';
import type {
  IWorkoutSessionRepository,
  SessionPageResult,
} from '../interfaces';
import type {
  WorkoutSessionDomain,
  WorkoutSetLogDomain,
} from '../domain/workout';
import type { StartSessionDto } from '../dto/start-session.dto';
import type { LogSetDto } from '../dto/log-set.dto';
import type { WorkoutHistoryFilterDto } from '../dto/workout-history-filter.dto';

/** Prisma-backed implementation of the workout session repository. */
@Injectable()
export class WorkoutSessionRepository implements IWorkoutSessionRepository {
  private readonly volumeStrategy = new WeightedVolumeStrategy();

  constructor(private readonly prisma: PrismaService) {}

  /** Find a session by ID. */
  async findById(id: string): Promise<WorkoutSessionDomain | null> {
    const record = await this.prisma.workoutSession.findUnique({
      where: { id },
    });
    if (!record) return null;
    return WorkoutMapper.sessionToDomain(record);
  }

  /** Find recent sessions for a user (with summary stats). */
  async findByUserId(
    userId: string,
    limit: number,
  ): Promise<WorkoutSessionDomain[]> {
    const records = await this.prisma.workoutSession.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      take: limit,
      include: { setLogs: true },
    });
    return records.map((r) => this.sessionWithSummary(r, r.setLogs));
  }

  /** Find sessions for a user with date-range filter and pagination (with summary stats). */
  async findHistory(
    userId: string,
    filter: WorkoutHistoryFilterDto,
  ): Promise<SessionPageResult> {
    const where = this.buildHistoryWhere(userId, filter);
    const skip = (filter.page - 1) * filter.limit;

    const [records, totalCount] = await this.prisma.$transaction([
      this.prisma.workoutSession.findMany({
        where,
        orderBy: { startedAt: 'desc' },
        skip,
        take: filter.limit,
        include: { setLogs: true },
      }),
      this.prisma.workoutSession.count({ where }),
    ]);

    return {
      data: records.map((r) => this.sessionWithSummary(r, r.setLogs)),
      totalCount,
    };
  }

  /** Start a new session. */
  async create(
    userId: string,
    data: StartSessionDto,
  ): Promise<WorkoutSessionDomain> {
    const record = await this.prisma.workoutSession.create({
      data: { userId, ...data },
    });
    return WorkoutMapper.sessionToDomain(record);
  }

  /** Mark a session as completed. */
  async complete(
    id: string,
    data: { rating?: number; notes?: string },
  ): Promise<WorkoutSessionDomain> {
    const record = await this.prisma.workoutSession.update({
      where: { id },
      data: {
        sessionStatus: 'COMPLETED',
        completedAt: new Date(),
        ...data,
      },
    });
    return WorkoutMapper.sessionToDomain(record);
  }

  /** Cancel a session. */
  async cancel(id: string): Promise<void> {
    await this.prisma.workoutSession.update({
      where: { id },
      data: { sessionStatus: 'CANCELLED' },
    });
  }

  /** Log a set within a session. */
  async logSet(
    sessionId: string,
    data: LogSetDto,
  ): Promise<WorkoutSetLogDomain> {
    const record = await this.prisma.workoutSetLog.create({
      data: { sessionId, ...data },
    });
    return WorkoutMapper.setLogToDomain(record);
  }

  /** Get all set logs for a session. */
  async findSetsBySessionId(sessionId: string): Promise<WorkoutSetLogDomain[]> {
    const records = await this.prisma.workoutSetLog.findMany({
      where: { sessionId },
      orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }],
    });
    return records.map(WorkoutMapper.setLogToDomain);
  }

  /** Count completed sessions for a user. */
  async countCompletedByUserId(userId: string): Promise<number> {
    return this.prisma.workoutSession.count({
      where: { userId, sessionStatus: 'COMPLETED' },
    });
  }

  private sessionWithSummary(
    record: import('@prisma/client').WorkoutSession,
    setLogs: import('@prisma/client').WorkoutSetLog[],
  ): WorkoutSessionDomain {
    const domain = WorkoutMapper.sessionToDomain(record);
    const uniqueExercises = new Set(setLogs.map((s) => s.exerciseId));
    const setData: SetData[] = setLogs.map((s) => ({
      weightKg: s.weightKg ? Number(s.weightKg) : null,
      repsCompleted: s.repsCompleted,
      isWarmup: s.isWarmup,
    }));

    domain.exerciseCount = uniqueExercises.size;
    domain.totalSets = setLogs.length;
    domain.totalVolume = Math.round(
      this.volumeStrategy.calculateVolume(setData),
    );
    return domain;
  }

  private buildHistoryWhere(
    userId: string,
    filter: WorkoutHistoryFilterDto,
  ): Prisma.WorkoutSessionWhereInput {
    const where: Prisma.WorkoutSessionWhereInput = {
      userId,
      sessionStatus: 'COMPLETED',
    };

    if (filter.from || filter.to) {
      where.completedAt = {};
      if (filter.from) where.completedAt.gte = filter.from;
      if (filter.to) where.completedAt.lte = filter.to;
    }

    return where;
  }
}
