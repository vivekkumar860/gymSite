import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { HabitDefinitionDomain, HabitEntryDomain } from '../domain/habit';
import { HabitMapper } from '../mappers/habit.mapper';
import type { IHabitRepository } from '../interfaces';
import type { CreateHabitDto } from '../dto/create-habit.dto';
import type { UpdateHabitDto } from '../dto/update-habit.dto';
import type { LogHabitEntryDto } from '../dto/log-habit-entry.dto';

/** Prisma-backed implementation of the habit repository contract. */
@Injectable()
export class HabitRepository implements IHabitRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Find a habit by ID. */
  async findById(id: string): Promise<HabitDefinitionDomain | null> {
    const record = await this.prisma.habitDefinition.findUnique({
      where: { id },
    });
    if (!record) return null;
    return HabitMapper.definitionToDomain(record);
  }

  /** Find all habits for a user. */
  async findByUserId(userId: string): Promise<HabitDefinitionDomain[]> {
    const records = await this.prisma.habitDefinition.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
    return records.map(HabitMapper.definitionToDomain);
  }

  /** Create a new habit. */
  async create(
    userId: string,
    data: CreateHabitDto,
  ): Promise<HabitDefinitionDomain> {
    const record = await this.prisma.habitDefinition.create({
      data: { ...data, userId },
    });
    return HabitMapper.definitionToDomain(record);
  }

  /** Update a habit. */
  async update(
    id: string,
    data: UpdateHabitDto,
  ): Promise<HabitDefinitionDomain> {
    const record = await this.prisma.habitDefinition.update({
      where: { id },
      data,
    });
    return HabitMapper.definitionToDomain(record);
  }

  /** Delete a habit. */
  async delete(id: string): Promise<void> {
    await this.prisma.habitDefinition.delete({ where: { id } });
  }

  /** Log or update an entry for a habit on a specific date. */
  async upsertEntry(
    habitId: string,
    dto: LogHabitEntryDto,
  ): Promise<HabitEntryDomain> {
    const entryDate = new Date(dto.entryDate);
    const record = await this.prisma.habitEntry.upsert({
      where: { uq_habit_entries_habit_date: { habitId, entryDate } },
      create: {
        habitId,
        entryDate,
        isCompleted: dto.isCompleted,
        recordedValue: dto.recordedValue,
        notes: dto.notes,
      },
      update: {
        isCompleted: dto.isCompleted,
        recordedValue: dto.recordedValue,
        notes: dto.notes,
      },
    });
    return HabitMapper.entryToDomain(record);
  }

  /** Get entries for a habit within a date range. */
  async findEntries(
    habitId: string,
    from: Date,
    to: Date,
  ): Promise<HabitEntryDomain[]> {
    const records = await this.prisma.habitEntry.findMany({
      where: {
        habitId,
        entryDate: { gte: from, lte: to },
      },
      orderBy: { entryDate: 'asc' },
    });
    return records.map(HabitMapper.entryToDomain);
  }

  /** Get all completed entry dates for streak calculation, ordered desc. */
  async findCompletedDates(habitId: string): Promise<Date[]> {
    const records = await this.prisma.habitEntry.findMany({
      where: { habitId, isCompleted: true },
      select: { entryDate: true },
      orderBy: { entryDate: 'desc' },
    });
    return records.map((r) => r.entryDate);
  }
}
