import type { HabitDefinitionDomain, HabitEntryDomain } from '../domain/habit';
import type { CreateHabitDto } from '../dto/create-habit.dto';
import type { UpdateHabitDto } from '../dto/update-habit.dto';
import type { LogHabitEntryDto } from '../dto/log-habit-entry.dto';

/**
 * Contract for habit data access.
 * Implementations handle Prisma queries and return domain types.
 */
export interface IHabitRepository {
  /** Find a habit definition by ID. */
  findById(id: string): Promise<HabitDefinitionDomain | null>;

  /** Find all habit definitions for a user. */
  findByUserId(userId: string): Promise<HabitDefinitionDomain[]>;

  /** Create a new habit definition. */
  create(userId: string, data: CreateHabitDto): Promise<HabitDefinitionDomain>;

  /** Update a habit definition. */
  update(id: string, data: UpdateHabitDto): Promise<HabitDefinitionDomain>;

  /** Delete a habit definition and its entries. */
  delete(id: string): Promise<void>;

  /** Log or update an entry for a habit on a specific date. Idempotent. */
  upsertEntry(
    habitId: string,
    dto: LogHabitEntryDto,
  ): Promise<HabitEntryDomain>;

  /** Get entries for a habit within a date range. */
  findEntries(
    habitId: string,
    from: Date,
    to: Date,
  ): Promise<HabitEntryDomain[]>;

  /** Get all completed entry dates for streak calculation, ordered desc. */
  findCompletedDates(habitId: string): Promise<Date[]>;
}

/** DI token for IHabitRepository. */
export const HABIT_REPOSITORY = Symbol('HABIT_REPOSITORY');
