import { ProgressEntry, BodyMeasurement, ProgressPhoto } from '@prisma/client';
import {
  ProgressEntryDomain,
  BodyMeasurementDomain,
  ProgressPhotoDomain,
} from '../domain/progress';
import {
  ProgressEntryResponseDto,
  BodyMeasurementResponseDto,
  ProgressPhotoResponseDto,
} from '../dto/progress-response.dto';

/** Maps between Prisma progress models, domain types, and response DTOs. */
export class ProgressMapper {
  static entryToDomain(record: ProgressEntry): ProgressEntryDomain {
    return {
      id: record.id,
      userId: record.userId,
      metricType: record.metricType,
      recordedValue: Number(record.recordedValue),
      recordedAt: record.recordedAt,
      notes: record.notes,
    };
  }

  static entryToResponse(
    domain: ProgressEntryDomain,
  ): ProgressEntryResponseDto {
    return {
      id: domain.id,
      metricType: domain.metricType,
      recordedValue: domain.recordedValue,
      recordedAt: domain.recordedAt.toISOString().split('T')[0],
      notes: domain.notes,
    };
  }

  static measurementToDomain(record: BodyMeasurement): BodyMeasurementDomain {
    return {
      id: record.id,
      userId: record.userId,
      site: record.site,
      valueCm: Number(record.valueCm),
      measuredAt: record.measuredAt,
      notes: record.notes,
    };
  }

  static measurementToResponse(
    domain: BodyMeasurementDomain,
  ): BodyMeasurementResponseDto {
    return {
      id: domain.id,
      site: domain.site,
      valueCm: domain.valueCm,
      measuredAt: domain.measuredAt.toISOString().split('T')[0],
      notes: domain.notes,
    };
  }

  static photoToDomain(record: ProgressPhoto): ProgressPhotoDomain {
    return {
      id: record.id,
      userId: record.userId,
      pose: record.pose,
      storagePath: record.storagePath,
      takenAt: record.takenAt,
      notes: record.notes,
    };
  }

  static photoToResponse(
    domain: ProgressPhotoDomain,
  ): ProgressPhotoResponseDto {
    return {
      id: domain.id,
      pose: domain.pose,
      storagePath: domain.storagePath,
      takenAt: domain.takenAt.toISOString().split('T')[0],
      notes: domain.notes,
    };
  }
}
