import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { z } from 'zod';
import { JwtAuthGuard } from '../../../common/guards';
import { CurrentUser } from '../../../common/decorators';
import { ZodValidationPipe } from '../../../common/pipes';
import {
  WorkoutAnalyticsService,
  type PersonalRecordDto,
  type WeeklyVolumeDto,
  type ProgressSummaryDto,
  type DashboardSummaryDto,
} from '../services/workout-analytics.service';

const VolumeByWeekQuerySchema = z.object({
  weeks: z.coerce.number().int().min(1).max(52).default(8),
});

/** Analytics endpoints derived from workout data. */
@Controller('workouts')
@UseGuards(JwtAuthGuard)
export class WorkoutAnalyticsController {
  constructor(private readonly analytics: WorkoutAnalyticsService) {}

  /** Get personal records per exercise. */
  @Get('personal-records')
  async getPersonalRecords(
    @CurrentUser() userId: string,
  ): Promise<PersonalRecordDto[]> {
    return this.analytics.getPersonalRecords(userId);
  }

  /** Get weekly volume totals. */
  @Get('volume-by-week')
  async getVolumeByWeek(
    @CurrentUser() userId: string,
    @Query(new ZodValidationPipe(VolumeByWeekQuerySchema))
    query: z.infer<typeof VolumeByWeekQuerySchema>,
  ): Promise<WeeklyVolumeDto[]> {
    return this.analytics.getVolumeByWeek(userId, query.weeks);
  }

  /** Get overall progress summary. */
  @Get('progress-summary')
  async getProgressSummary(
    @CurrentUser() userId: string,
  ): Promise<ProgressSummaryDto> {
    return this.analytics.getProgressSummary(userId);
  }

  /** Get dashboard summary combining data from multiple modules. */
  @Get('dashboard-summary')
  async getDashboardSummary(
    @CurrentUser() userId: string,
  ): Promise<DashboardSummaryDto> {
    return this.analytics.getDashboardSummary(userId);
  }
}
