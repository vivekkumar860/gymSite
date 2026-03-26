import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { HabitService } from '../services/habit.service';
import { ZodValidationPipe } from '../../../common/pipes';
import { JwtAuthGuard } from '../../../common/guards';
import { CurrentUser } from '../../../common/decorators';
import { CreateHabitSchema } from '../dto/create-habit.dto';
import { UpdateHabitSchema } from '../dto/update-habit.dto';
import { LogHabitEntrySchema } from '../dto/log-habit-entry.dto';
import { HabitEntryFilterSchema } from '../dto/habit-entry-filter.dto';
import type { CreateHabitDto } from '../dto/create-habit.dto';
import type { UpdateHabitDto } from '../dto/update-habit.dto';
import type { LogHabitEntryDto } from '../dto/log-habit-entry.dto';
import type { HabitEntryFilterDto } from '../dto/habit-entry-filter.dto';
import type {
  HabitResponseDto,
  HabitEntryResponseDto,
} from '../dto/habit-response.dto';

/** Handles habit definition and entry endpoints. */
@Controller('habits')
@UseGuards(JwtAuthGuard)
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  /** List all habits for the authenticated user with streaks. */
  @Get()
  async listHabits(@CurrentUser() userId: string): Promise<HabitResponseDto[]> {
    return this.habitService.getUserHabits(userId);
  }

  /** Create a new habit. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createHabit(
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(CreateHabitSchema)) dto: CreateHabitDto,
  ): Promise<HabitResponseDto> {
    return this.habitService.createHabit(userId, dto);
  }

  /** Update a habit. */
  @Patch(':habitId')
  async updateHabit(
    @Param('habitId', ParseUUIDPipe) habitId: string,
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(UpdateHabitSchema)) dto: UpdateHabitDto,
  ): Promise<HabitResponseDto> {
    return this.habitService.updateHabit(habitId, userId, dto);
  }

  /** Delete a habit. */
  @Delete(':habitId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteHabit(
    @Param('habitId', ParseUUIDPipe) habitId: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.habitService.deleteHabit(habitId, userId);
  }

  /** Log a habit entry for a specific date. */
  @Post(':habitId/entries')
  @HttpCode(HttpStatus.CREATED)
  async logEntry(
    @Param('habitId', ParseUUIDPipe) habitId: string,
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(LogHabitEntrySchema)) dto: LogHabitEntryDto,
  ): Promise<HabitEntryResponseDto> {
    return this.habitService.logEntry(habitId, userId, dto);
  }

  /** Get entries for a habit within a date range. */
  @Get(':habitId/entries')
  async getEntries(
    @Param('habitId', ParseUUIDPipe) habitId: string,
    @CurrentUser() userId: string,
    @Query(new ZodValidationPipe(HabitEntryFilterSchema))
    filter: HabitEntryFilterDto,
  ): Promise<HabitEntryResponseDto[]> {
    return this.habitService.getEntries(
      habitId,
      userId,
      filter.from,
      filter.to,
    );
  }
}
