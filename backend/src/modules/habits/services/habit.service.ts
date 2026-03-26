import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HABIT_REPOSITORY } from '../interfaces';
import { StreakCalculatorService } from './streak-calculator.service';
import type { IHabitRepository } from '../interfaces';
import { HabitMapper } from '../mappers/habit.mapper';
import { HabitEntryLoggedEvent } from '../events/habit-entry-logged.event';
import { NotFoundError, AuthorizationError } from '../../../common/errors';
import { DOMAIN_EVENTS } from '../../../common/constants';
import type { CreateHabitDto } from '../dto/create-habit.dto';
import type { UpdateHabitDto } from '../dto/update-habit.dto';
import type { LogHabitEntryDto } from '../dto/log-habit-entry.dto';
import type {
  HabitResponseDto,
  HabitEntryResponseDto,
} from '../dto/habit-response.dto';

/** Business logic for habits, entries, and streaks. */
@Injectable()
export class HabitService {
  constructor(
    @Inject(HABIT_REPOSITORY) private readonly habitRepo: IHabitRepository,
    private readonly streakCalc: StreakCalculatorService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /** Get all habits for a user with streak data. */
  async getUserHabits(userId: string): Promise<HabitResponseDto[]> {
    const habits = await this.habitRepo.findByUserId(userId);

    return Promise.all(
      habits.map(async (habit) => {
        const dates = await this.habitRepo.findCompletedDates(habit.id);
        const streak = this.streakCalc.calculateStreak(dates);
        return HabitMapper.definitionToResponse(habit, streak);
      }),
    );
  }

  /** Create a new habit. */
  async createHabit(
    userId: string,
    dto: CreateHabitDto,
  ): Promise<HabitResponseDto> {
    const habit = await this.habitRepo.create(userId, dto);
    const emptyStreak = { currentStreak: 0, longestStreak: 0 };
    return HabitMapper.definitionToResponse(habit, emptyStreak);
  }

  /** Update a habit. */
  async updateHabit(
    habitId: string,
    userId: string,
    dto: UpdateHabitDto,
  ): Promise<HabitResponseDto> {
    const habit = await this.findHabitOrFail(habitId);
    this.ensureOwnership(habit.userId, userId);

    const updated = await this.habitRepo.update(habitId, dto);
    const dates = await this.habitRepo.findCompletedDates(habitId);
    const streak = this.streakCalc.calculateStreak(dates);
    return HabitMapper.definitionToResponse(updated, streak);
  }

  /** Delete a habit. */
  async deleteHabit(habitId: string, userId: string): Promise<void> {
    const habit = await this.findHabitOrFail(habitId);
    this.ensureOwnership(habit.userId, userId);
    await this.habitRepo.delete(habitId);
  }

  /** Log a habit entry and emit event. */
  async logEntry(
    habitId: string,
    userId: string,
    dto: LogHabitEntryDto,
  ): Promise<HabitEntryResponseDto> {
    const habit = await this.findHabitOrFail(habitId);
    this.ensureOwnership(habit.userId, userId);

    const entry = await this.habitRepo.upsertEntry(habitId, dto);

    this.eventEmitter.emit(
      DOMAIN_EVENTS.HABIT_ENTRY_LOGGED,
      new HabitEntryLoggedEvent(
        userId,
        habitId,
        dto.entryDate,
        dto.isCompleted,
      ),
    );

    return HabitMapper.entryToResponse(entry);
  }

  /** Get entries for a habit within a date range. */
  async getEntries(
    habitId: string,
    userId: string,
    from: string,
    to: string,
  ): Promise<HabitEntryResponseDto[]> {
    const habit = await this.findHabitOrFail(habitId);
    this.ensureOwnership(habit.userId, userId);

    const entries = await this.habitRepo.findEntries(
      habitId,
      new Date(from),
      new Date(to),
    );
    return entries.map(HabitMapper.entryToResponse);
  }

  // ── Private helpers ──────────────────────────────────────────

  private async findHabitOrFail(habitId: string) {
    const habit = await this.habitRepo.findById(habitId);
    if (!habit) throw new NotFoundError('HabitDefinition', habitId);
    return habit;
  }

  private ensureOwnership(ownerId: string, requesterId: string): void {
    if (ownerId !== requesterId) {
      throw new AuthorizationError('You do not own this resource');
    }
  }
}
