import type {
  WorkoutSessionDomain,
  WorkoutSetLogDomain,
} from '../domain/workout';
import type { StartSessionDto } from '../dto/start-session.dto';
import type { LogSetDto } from '../dto/log-set.dto';
import type { WorkoutHistoryFilterDto } from '../dto/workout-history-filter.dto';

/** Paginated session result. */
export interface SessionPageResult {
  data: WorkoutSessionDomain[];
  totalCount: number;
}

/**
 * Contract for workout session and set log data access.
 */
export interface IWorkoutSessionRepository {
  /** Find a session by ID. */
  findById(id: string): Promise<WorkoutSessionDomain | null>;

  /** Find recent sessions for a user. */
  findByUserId(userId: string, limit: number): Promise<WorkoutSessionDomain[]>;

  /** Find sessions for a user with date-range filter and pagination. */
  findHistory(
    userId: string,
    filter: WorkoutHistoryFilterDto,
  ): Promise<SessionPageResult>;

  /** Start a new session. */
  create(userId: string, data: StartSessionDto): Promise<WorkoutSessionDomain>;

  /** Mark a session as completed. */
  complete(
    id: string,
    data: { rating?: number; notes?: string },
  ): Promise<WorkoutSessionDomain>;

  /** Cancel a session. */
  cancel(id: string): Promise<void>;

  /** Log a set within a session. */
  logSet(sessionId: string, data: LogSetDto): Promise<WorkoutSetLogDomain>;

  /** Get all set logs for a session. */
  findSetsBySessionId(sessionId: string): Promise<WorkoutSetLogDomain[]>;

  /** Find a single set log by ID. */
  findSetById(setId: string): Promise<WorkoutSetLogDomain | null>;

  /** Delete a set log by ID. */
  deleteSet(setId: string): Promise<void>;

  /** Count completed sessions for a user. */
  countCompletedByUserId(userId: string): Promise<number>;
}

/** DI token for IWorkoutSessionRepository. */
export const WORKOUT_SESSION_REPOSITORY = Symbol('WORKOUT_SESSION_REPOSITORY');
