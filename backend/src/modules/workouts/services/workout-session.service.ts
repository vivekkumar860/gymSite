import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WORKOUT_SESSION_REPOSITORY } from '../interfaces';
import { WorkoutMapper } from '../mappers/workout.mapper';
import { WorkoutSessionCompletedEvent } from '../events/workout-session-completed.event';
import {
  NotFoundError,
  AuthorizationError,
  DomainError,
} from '../../../common/errors';
import { DOMAIN_EVENTS, ERROR_CODES } from '../../../common/constants';
import {
  WeightedVolumeStrategy,
  type VolumeCalculatorStrategy,
  type SetData,
} from '../strategies/volume-calculator.strategy';
import type { IWorkoutSessionRepository } from '../interfaces';
import type { StartSessionDto } from '../dto/start-session.dto';
import type { CompleteSessionDto } from '../dto/complete-session.dto';
import type { LogSetDto } from '../dto/log-set.dto';
import type { WorkoutHistoryFilterDto } from '../dto/workout-history-filter.dto';
import type {
  WorkoutSessionResponseDto,
  WorkoutSetLogResponseDto,
} from '../dto/workout-response.dto';
import type { PaginatedResult } from '../../../common/types/pagination';

const MINUTES_PER_MS = 60_000;

/** Business logic for workout sessions and set logging. */
@Injectable()
export class WorkoutSessionService {
  private readonly volumeStrategy: VolumeCalculatorStrategy;

  constructor(
    @Inject(WORKOUT_SESSION_REPOSITORY)
    private readonly sessionRepo: IWorkoutSessionRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.volumeStrategy = new WeightedVolumeStrategy();
  }

  /** Start a new workout session. */
  async startSession(
    userId: string,
    dto: StartSessionDto,
  ): Promise<WorkoutSessionResponseDto> {
    const session = await this.sessionRepo.create(userId, dto);
    return WorkoutMapper.sessionToResponse(session);
  }

  /** Get recent sessions for a user. */
  async getRecentSessions(
    userId: string,
    limit: number,
  ): Promise<WorkoutSessionResponseDto[]> {
    const sessions = await this.sessionRepo.findByUserId(userId, limit);
    return sessions.map(WorkoutMapper.sessionToResponse);
  }

  /** Get session history with date-range filter and pagination. */
  async getHistory(
    userId: string,
    filter: WorkoutHistoryFilterDto,
  ): Promise<PaginatedResult<WorkoutSessionResponseDto>> {
    const { data, totalCount } = await this.sessionRepo.findHistory(
      userId,
      filter,
    );

    return {
      data: data.map(WorkoutMapper.sessionToResponse),
      meta: {
        page: filter.page,
        limit: filter.limit,
        totalCount,
        totalPages: Math.ceil(totalCount / filter.limit),
      },
    };
  }

  /** Get a session by ID with ownership check. */
  async getSessionById(
    sessionId: string,
    userId: string,
  ): Promise<WorkoutSessionResponseDto> {
    const session = await this.findSessionOrFail(sessionId);
    this.ensureOwnership(session.userId, userId);
    return WorkoutMapper.sessionToResponse(session);
  }

  /** Log a set within a session. */
  async logSet(
    sessionId: string,
    userId: string,
    dto: LogSetDto,
  ): Promise<WorkoutSetLogResponseDto> {
    const session = await this.findSessionOrFail(sessionId);
    this.ensureOwnership(session.userId, userId);
    this.ensureSessionInProgress(session.sessionStatus);

    const setLog = await this.sessionRepo.logSet(sessionId, dto);
    return WorkoutMapper.setLogToResponse(setLog);
  }

  /** Get all sets for a session. */
  async getSessionSets(
    sessionId: string,
    userId: string,
  ): Promise<WorkoutSetLogResponseDto[]> {
    const session = await this.findSessionOrFail(sessionId);
    this.ensureOwnership(session.userId, userId);

    const sets = await this.sessionRepo.findSetsBySessionId(sessionId);
    return sets.map(WorkoutMapper.setLogToResponse);
  }

  /** Delete a set from a session. */
  async deleteSet(
    sessionId: string,
    setId: string,
    userId: string,
  ): Promise<void> {
    const session = await this.findSessionOrFail(sessionId);
    this.ensureOwnership(session.userId, userId);
    this.ensureSessionInProgress(session.sessionStatus);

    const setLog = await this.sessionRepo.findSetById(setId);
    if (!setLog) throw new NotFoundError('WorkoutSetLog', setId);
    if (setLog.sessionId !== sessionId) {
      throw new NotFoundError('WorkoutSetLog', setId);
    }

    await this.sessionRepo.deleteSet(setId);
  }

  /** Complete a workout session and emit event. */
  async completeSession(
    sessionId: string,
    userId: string,
    dto: CompleteSessionDto,
  ): Promise<WorkoutSessionResponseDto> {
    const session = await this.findSessionOrFail(sessionId);
    this.ensureOwnership(session.userId, userId);
    this.ensureSessionInProgress(session.sessionStatus);

    const completed = await this.sessionRepo.complete(sessionId, dto);
    const sets = await this.sessionRepo.findSetsBySessionId(sessionId);

    const setData: SetData[] = sets.map((s) => ({
      weightKg: s.weightKg,
      repsCompleted: s.repsCompleted,
      isWarmup: s.isWarmup,
    }));

    const totalVolume = this.volumeStrategy.calculateVolume(setData);
    const durationMinutes = this.calculateDuration(
      session.startedAt,
      completed.completedAt!,
    );

    this.eventEmitter.emit(
      DOMAIN_EVENTS.WORKOUT_SESSION_COMPLETED,
      new WorkoutSessionCompletedEvent(
        userId,
        sessionId,
        session.dayId,
        totalVolume,
        sets.length,
        durationMinutes,
        completed.completedAt!,
      ),
    );

    return WorkoutMapper.sessionToResponse(completed);
  }

  /** Cancel a workout session. */
  async cancelSession(sessionId: string, userId: string): Promise<void> {
    const session = await this.findSessionOrFail(sessionId);
    this.ensureOwnership(session.userId, userId);
    this.ensureSessionInProgress(session.sessionStatus);
    await this.sessionRepo.cancel(sessionId);
  }

  // ── Private helpers ──────────────────────────────────────────

  private async findSessionOrFail(sessionId: string) {
    const session = await this.sessionRepo.findById(sessionId);
    if (!session) throw new NotFoundError('WorkoutSession', sessionId);
    return session;
  }

  private ensureOwnership(ownerId: string, requesterId: string): void {
    if (ownerId !== requesterId) {
      throw new AuthorizationError('You do not own this resource');
    }
  }

  private ensureSessionInProgress(status: string): void {
    if (status !== 'IN_PROGRESS') {
      throw new DomainError(
        ERROR_CODES.RESOURCE_CONFLICT,
        'Session is not in progress',
        409,
      );
    }
  }

  private calculateDuration(startedAt: Date, completedAt: Date): number {
    return Math.round(
      (completedAt.getTime() - startedAt.getTime()) / MINUTES_PER_MS,
    );
  }
}
