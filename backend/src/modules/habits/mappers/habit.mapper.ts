import { HabitDefinition, HabitEntry } from '@prisma/client';
import {
  HabitDefinitionDomain,
  HabitEntryDomain,
  HabitStreak,
} from '../domain/habit';
import {
  HabitResponseDto,
  HabitEntryResponseDto,
} from '../dto/habit-response.dto';

/** Maps between Prisma habit models, domain types, and response DTOs. */
export class HabitMapper {
  static definitionToDomain(record: HabitDefinition): HabitDefinitionDomain {
    return {
      id: record.id,
      userId: record.userId,
      habitName: record.habitName,
      frequency: record.frequency,
      targetValue: record.targetValue ? Number(record.targetValue) : null,
      unitLabel: record.unitLabel,
      isActive: record.isActive,
      colorHex: record.colorHex,
      createdAt: record.createdAt,
    };
  }

  static definitionToResponse(
    domain: HabitDefinitionDomain,
    streak: HabitStreak,
  ): HabitResponseDto {
    return {
      id: domain.id,
      habitName: domain.habitName,
      frequency: domain.frequency,
      targetValue: domain.targetValue,
      unitLabel: domain.unitLabel,
      isActive: domain.isActive,
      colorHex: domain.colorHex,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
    };
  }

  static entryToDomain(record: HabitEntry): HabitEntryDomain {
    return {
      id: record.id,
      habitId: record.habitId,
      entryDate: record.entryDate,
      isCompleted: record.isCompleted,
      recordedValue: record.recordedValue ? Number(record.recordedValue) : null,
      notes: record.notes,
    };
  }

  static entryToResponse(domain: HabitEntryDomain): HabitEntryResponseDto {
    return {
      id: domain.id,
      habitId: domain.habitId,
      entryDate: domain.entryDate.toISOString().split('T')[0],
      isCompleted: domain.isCompleted,
      recordedValue: domain.recordedValue,
      notes: domain.notes,
    };
  }
}
