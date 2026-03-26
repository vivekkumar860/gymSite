import { Injectable } from '@nestjs/common';
import { ProgressRepository } from '../repositories/progress.repository';
import { ProgressMapper } from '../mappers/progress.mapper';
import type {
  ProgressEntryResponseDto,
  BodyMeasurementResponseDto,
  ProgressPhotoResponseDto,
} from '../dto/progress-response.dto';

const DEFAULT_QUERY_LIMIT = 30;

/** Read side of progress module (CQRS query). */
@Injectable()
export class ProgressQueryService {
  constructor(private readonly progressRepo: ProgressRepository) {}

  /** Get recent progress entries for a metric type. */
  async getEntries(
    userId: string,
    metricType: string,
    limit = DEFAULT_QUERY_LIMIT,
  ): Promise<ProgressEntryResponseDto[]> {
    const entries = await this.progressRepo.findEntries(
      userId,
      metricType,
      limit,
    );
    return entries.map(ProgressMapper.entryToResponse);
  }

  /** Get the latest value for a metric. */
  async getLatestEntry(
    userId: string,
    metricType: string,
  ): Promise<ProgressEntryResponseDto | null> {
    const entry = await this.progressRepo.findLatestEntry(userId, metricType);
    if (!entry) return null;
    return ProgressMapper.entryToResponse(entry);
  }

  /** Get recent body measurements. */
  async getRecentMeasurements(
    userId: string,
    limit = DEFAULT_QUERY_LIMIT,
  ): Promise<BodyMeasurementResponseDto[]> {
    const measurements = await this.progressRepo.findRecentMeasurements(
      userId,
      limit,
    );
    return measurements.map(ProgressMapper.measurementToResponse);
  }

  /** Get progress photos. */
  async getPhotos(
    userId: string,
    limit = DEFAULT_QUERY_LIMIT,
  ): Promise<ProgressPhotoResponseDto[]> {
    const photos = await this.progressRepo.findPhotos(userId, limit);
    return photos.map(ProgressMapper.photoToResponse);
  }
}
