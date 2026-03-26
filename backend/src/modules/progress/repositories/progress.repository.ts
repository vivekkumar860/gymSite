import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import {
  ProgressEntryDomain,
  BodyMeasurementDomain,
  ProgressPhotoDomain,
} from '../domain/progress';
import { ProgressMapper } from '../mappers/progress.mapper';
import type { RecordProgressDto } from '../dto/record-progress.dto';
import type { RecordMeasurementDto } from '../dto/record-measurement.dto';

/** Data access for all progress-related data. */
@Injectable()
export class ProgressRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ── Progress entries ─────────────────────────────────────────

  /** Record a progress entry. Upserts by user+metric+date. */
  async upsertEntry(
    userId: string,
    dto: RecordProgressDto,
  ): Promise<ProgressEntryDomain> {
    const recordedAt = new Date(dto.recordedAt);
    const record = await this.prisma.progressEntry.upsert({
      where: {
        uq_progress_entries_user_metric_date: {
          userId,
          metricType: dto.metricType as any,
          recordedAt,
        },
      },
      create: {
        userId,
        metricType: dto.metricType as any,
        recordedValue: dto.recordedValue,
        recordedAt,
        notes: dto.notes,
      },
      update: {
        recordedValue: dto.recordedValue,
        notes: dto.notes,
      },
    });
    return ProgressMapper.entryToDomain(record);
  }

  /** Get entries for a user by metric type, ordered by date desc. */
  async findEntries(
    userId: string,
    metricType: string,
    limit: number,
  ): Promise<ProgressEntryDomain[]> {
    const records = await this.prisma.progressEntry.findMany({
      where: { userId, metricType: metricType as any },
      orderBy: { recordedAt: 'desc' },
      take: limit,
    });
    return records.map(ProgressMapper.entryToDomain);
  }

  /** Get the latest entry for a metric type. */
  async findLatestEntry(
    userId: string,
    metricType: string,
  ): Promise<ProgressEntryDomain | null> {
    const record = await this.prisma.progressEntry.findFirst({
      where: { userId, metricType: metricType as any },
      orderBy: { recordedAt: 'desc' },
    });
    if (!record) return null;
    return ProgressMapper.entryToDomain(record);
  }

  // ── Weekly summary queries ──────────────────────────────────

  /** Get dates on which the user completed a workout session within a range. */
  async findCompletedWorkoutDates(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<Date[]> {
    const records = await this.prisma.workoutSession.findMany({
      where: {
        userId,
        sessionStatus: 'COMPLETED',
        completedAt: { gte: from, lte: to },
      },
      select: { completedAt: true },
    });
    return records
      .filter((r): r is { completedAt: Date } => r.completedAt !== null)
      .map((r) => r.completedAt);
  }

  /**
   * Get per-day habit completion stats within a date range.
   * Returns the count of completed habits and total active daily habits for each day.
   */
  async findDailyHabitStats(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<{ date: Date; completed: number }[]> {
    const entries = await this.prisma.habitEntry.findMany({
      where: {
        habit: { userId, isActive: true, frequency: 'DAILY' },
        entryDate: { gte: from, lte: to },
        isCompleted: true,
      },
      select: { entryDate: true },
    });

    // Group by date string to count completions per day
    const countByDate = new Map<string, number>();
    for (const e of entries) {
      const key = e.entryDate.toISOString().split('T')[0];
      countByDate.set(key, (countByDate.get(key) ?? 0) + 1);
    }

    return [...countByDate.entries()].map(([dateStr, completed]) => ({
      date: new Date(dateStr),
      completed,
    }));
  }

  /** Count active daily habits for a user. */
  async countActiveDailyHabits(userId: string): Promise<number> {
    return this.prisma.habitDefinition.count({
      where: { userId, isActive: true, frequency: 'DAILY' },
    });
  }

  /** Get the active workout plan's daysPerWeek, or null if none. */
  async getActivePlanDaysPerWeek(userId: string): Promise<number | null> {
    const plan = await this.prisma.workoutPlan.findFirst({
      where: { userId, planStatus: 'ACTIVE' },
      select: { daysPerWeek: true },
    });
    return plan?.daysPerWeek ?? null;
  }

  // ── Body measurements ────────────────────────────────────────

  /** Record a body measurement. Upserts by user+site+date. */
  async upsertMeasurement(
    userId: string,
    dto: RecordMeasurementDto,
  ): Promise<BodyMeasurementDomain> {
    const measuredAt = new Date(dto.measuredAt);
    const record = await this.prisma.bodyMeasurement.upsert({
      where: {
        uq_body_measurements_user_site_date: {
          userId,
          site: dto.site as any,
          measuredAt,
        },
      },
      create: {
        userId,
        site: dto.site as any,
        valueCm: dto.valueCm,
        measuredAt,
        notes: dto.notes,
      },
      update: {
        valueCm: dto.valueCm,
        notes: dto.notes,
      },
    });
    return ProgressMapper.measurementToDomain(record);
  }

  /** Get recent measurements for a user. */
  async findRecentMeasurements(
    userId: string,
    limit: number,
  ): Promise<BodyMeasurementDomain[]> {
    const records = await this.prisma.bodyMeasurement.findMany({
      where: { userId },
      orderBy: { measuredAt: 'desc' },
      take: limit,
    });
    return records.map(ProgressMapper.measurementToDomain);
  }

  // ── Progress photos ──────────────────────────────────────────

  /** Save photo metadata. */
  async createPhoto(
    userId: string,
    data: { pose: string; storagePath: string; takenAt: Date; notes?: string },
  ): Promise<ProgressPhotoDomain> {
    const record = await this.prisma.progressPhoto.create({
      data: {
        userId,
        pose: data.pose as any,
        storagePath: data.storagePath,
        takenAt: data.takenAt,
        notes: data.notes,
      },
    });
    return ProgressMapper.photoToDomain(record);
  }

  /** Get photos for a user, ordered by date desc. */
  async findPhotos(
    userId: string,
    limit: number,
  ): Promise<ProgressPhotoDomain[]> {
    const records = await this.prisma.progressPhoto.findMany({
      where: { userId },
      orderBy: { takenAt: 'desc' },
      take: limit,
    });
    return records.map(ProgressMapper.photoToDomain);
  }

  /** Find a photo by ID. */
  async findPhotoById(photoId: string): Promise<ProgressPhotoDomain | null> {
    const record = await this.prisma.progressPhoto.findUnique({
      where: { id: photoId },
    });
    if (!record) return null;
    return ProgressMapper.photoToDomain(record);
  }

  /** Delete a photo record. */
  async deletePhoto(photoId: string): Promise<ProgressPhotoDomain> {
    const record = await this.prisma.progressPhoto.delete({
      where: { id: photoId },
    });
    return ProgressMapper.photoToDomain(record);
  }
}
