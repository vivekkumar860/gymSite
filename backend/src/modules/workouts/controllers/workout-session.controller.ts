import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WorkoutSessionService } from '../services/workout-session.service';
import { ZodValidationPipe } from '../../../common/pipes';
import { JwtAuthGuard } from '../../../common/guards';
import { CurrentUser } from '../../../common/decorators';
import { StartSessionSchema } from '../dto/start-session.dto';
import { CompleteSessionSchema } from '../dto/complete-session.dto';
import { LogSetSchema } from '../dto/log-set.dto';
import { WorkoutHistoryFilterSchema } from '../dto/workout-history-filter.dto';
import type { StartSessionDto } from '../dto/start-session.dto';
import type { CompleteSessionDto } from '../dto/complete-session.dto';
import type { LogSetDto } from '../dto/log-set.dto';
import type { WorkoutHistoryFilterDto } from '../dto/workout-history-filter.dto';
import type {
  WorkoutSessionResponseDto,
  WorkoutSetLogResponseDto,
} from '../dto/workout-response.dto';
import type { PaginatedResult } from '../../../common/types/pagination';
import { z } from 'zod';

const DEFAULT_RECENT_SESSIONS_LIMIT = 20;
const RecentSessionsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(DEFAULT_RECENT_SESSIONS_LIMIT),
});

/** Handles workout session and set logging endpoints. */
@Controller('workout-sessions')
@UseGuards(JwtAuthGuard)
export class WorkoutSessionController {
  constructor(private readonly sessionService: WorkoutSessionService) {}

  /** List recent workout sessions. */
  @Get()
  async listRecent(
    @CurrentUser() userId: string,
    @Query(new ZodValidationPipe(RecentSessionsQuerySchema))
    query: z.infer<typeof RecentSessionsQuerySchema>,
  ): Promise<WorkoutSessionResponseDto[]> {
    return this.sessionService.getRecentSessions(userId, query.limit);
  }

  /** Get workout session history with date-range filter and pagination. */
  @Get('history')
  async getHistory(
    @CurrentUser() userId: string,
    @Query(new ZodValidationPipe(WorkoutHistoryFilterSchema))
    filter: WorkoutHistoryFilterDto,
  ): Promise<PaginatedResult<WorkoutSessionResponseDto>> {
    return this.sessionService.getHistory(userId, filter);
  }

  /** Get a single session. */
  @Get(':sessionId')
  async getSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @CurrentUser() userId: string,
  ): Promise<WorkoutSessionResponseDto> {
    return this.sessionService.getSessionById(sessionId, userId);
  }

  /** Start a new workout session. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async startSession(
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(StartSessionSchema)) dto: StartSessionDto,
  ): Promise<WorkoutSessionResponseDto> {
    return this.sessionService.startSession(userId, dto);
  }

  /** Complete a workout session. */
  @Post(':sessionId/complete')
  async completeSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(CompleteSessionSchema)) dto: CompleteSessionDto,
  ): Promise<WorkoutSessionResponseDto> {
    return this.sessionService.completeSession(sessionId, userId, dto);
  }

  /** Cancel a workout session. */
  @Post(':sessionId/cancel')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.sessionService.cancelSession(sessionId, userId);
  }

  /** Log a set within a session. */
  @Post(':sessionId/sets')
  @HttpCode(HttpStatus.CREATED)
  async logSet(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(LogSetSchema)) dto: LogSetDto,
  ): Promise<WorkoutSetLogResponseDto> {
    return this.sessionService.logSet(sessionId, userId, dto);
  }

  /** Get all sets for a session. */
  @Get(':sessionId/sets')
  async getSessionSets(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @CurrentUser() userId: string,
  ): Promise<WorkoutSetLogResponseDto[]> {
    return this.sessionService.getSessionSets(sessionId, userId);
  }

  /** Delete a set from a session. */
  @Delete(':sessionId/sets/:setId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSet(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Param('setId', ParseUUIDPipe) setId: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.sessionService.deleteSet(sessionId, setId, userId);
  }
}
