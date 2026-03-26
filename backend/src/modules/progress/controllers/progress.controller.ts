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
import type {
  ProgressEntryResponseDto,
  BodyMeasurementResponseDto,
  ProgressPhotoResponseDto,
  ProgressSummaryResponseDto,
  WeeklySummaryResponseDto,
} from '../dto/progress-response.dto';

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
    @Query('metricType') metricType: string,
    @Query('limit') limit?: string,
  ): Promise<ProgressEntryResponseDto[]> {
    return this.queryService.getEntries(
      userId,
      metricType,
      Number(limit) || undefined,
    );
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
    @Query('limit') limit?: string,
  ): Promise<BodyMeasurementResponseDto[]> {
    return this.queryService.getRecentMeasurements(
      userId,
      Number(limit) || undefined,
    );
  }

  /** Get progress photos. */
  @Get('photos')
  async getPhotos(
    @CurrentUser() userId: string,
    @Query('limit') limit?: string,
  ): Promise<ProgressPhotoResponseDto[]> {
    return this.queryService.getPhotos(userId, Number(limit) || undefined);
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
