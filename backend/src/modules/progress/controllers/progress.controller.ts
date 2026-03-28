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
import { ProgressCommandService } from '../services/progress-command.service';
import { ProgressQueryService } from '../services/progress-query.service';
import { ProgressFacade } from '../facades/progress.facade';
import { ZodValidationPipe } from '../../../common/pipes';
import { JwtAuthGuard } from '../../../common/guards';
import { CurrentUser } from '../../../common/decorators';
import { RecordProgressSchema } from '../dto/record-progress.dto';
import { RecordMeasurementSchema } from '../dto/record-measurement.dto';
import { z } from 'zod';
import type {
  ProgressEntryResponseDto,
  BodyMeasurementResponseDto,
  ProgressPhotoResponseDto,
  ProgressSummaryResponseDto,
  WeeklySummaryResponseDto,
} from '../dto/progress-response.dto';

const VALID_METRIC_TYPES = ['BODY_WEIGHT', 'BODY_FAT_PCT', 'RESTING_HEART_RATE'] as const;

const ProgressEntriesQuerySchema = z.object({
  metricType: z.enum(VALID_METRIC_TYPES),
  limit: z.coerce.number().int().min(1).max(100).default(30),
});

const LimitQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(30),
});

/** Handles all progress tracking endpoints. */
@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(
    private readonly commandService: ProgressCommandService,
    private readonly queryService: ProgressQueryService,
    private readonly facade: ProgressFacade,
  ) {}

  /** Get the user's progress summary dashboard. */
  @Get('summary')
  async getSummary(
    @CurrentUser() userId: string,
  ): Promise<ProgressSummaryResponseDto> {
    return this.facade.getSummary(userId);
  }

  /** Get the user's weekly overview for the dashboard. */
  @Get('weekly-summary')
  async getWeeklySummary(
    @CurrentUser() userId: string,
  ): Promise<WeeklySummaryResponseDto> {
    return this.facade.getWeeklySummary(userId);
  }

  /** Record a progress entry (weight, body fat, etc.). */
  @Post('entries')
  @HttpCode(HttpStatus.CREATED)
  async recordEntry(
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(RecordProgressSchema)) dto: any,
  ): Promise<ProgressEntryResponseDto> {
    return this.commandService.recordProgressEntry(userId, dto);
  }

  /** Get progress entries for a metric type. */
  @Get('entries')
  async getEntries(
    @CurrentUser() userId: string,
    @Query(new ZodValidationPipe(ProgressEntriesQuerySchema))
    query: z.infer<typeof ProgressEntriesQuerySchema>,
  ): Promise<ProgressEntryResponseDto[]> {
    return this.queryService.getEntries(userId, query.metricType, query.limit);
  }

  /** Record a body measurement. */
  @Post('measurements')
  @HttpCode(HttpStatus.CREATED)
  async recordMeasurement(
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(RecordMeasurementSchema)) dto: any,
  ): Promise<BodyMeasurementResponseDto> {
    return this.commandService.recordMeasurement(userId, dto);
  }

  /** Get recent body measurements. */
  @Get('measurements')
  async getMeasurements(
    @CurrentUser() userId: string,
    @Query(new ZodValidationPipe(LimitQuerySchema))
    query: z.infer<typeof LimitQuerySchema>,
  ): Promise<BodyMeasurementResponseDto[]> {
    return this.queryService.getRecentMeasurements(userId, query.limit);
  }

  /** Get progress photos. */
  @Get('photos')
  async getPhotos(
    @CurrentUser() userId: string,
    @Query(new ZodValidationPipe(LimitQuerySchema))
    query: z.infer<typeof LimitQuerySchema>,
  ): Promise<ProgressPhotoResponseDto[]> {
    return this.queryService.getPhotos(userId, query.limit);
  }

  /** Delete a progress photo. */
  @Delete('photos/:photoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePhoto(
    @Param('photoId', ParseUUIDPipe) photoId: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.commandService.deletePhoto(userId, photoId);
  }
}
