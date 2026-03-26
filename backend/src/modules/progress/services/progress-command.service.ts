import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProgressRepository } from '../repositories/progress.repository';
import { ProgressMapper } from '../mappers/progress.mapper';
import { NotFoundError, AuthorizationError } from '../../../common/errors';
import { DOMAIN_EVENTS } from '../../../common/constants';
import type { RecordProgressDto } from '../dto/record-progress.dto';
import type { RecordMeasurementDto } from '../dto/record-measurement.dto';
import type {
  ProgressEntryResponseDto,
  BodyMeasurementResponseDto,
  ProgressPhotoResponseDto,
} from '../dto/progress-response.dto';

/** Write side of progress module (CQRS command). */
@Injectable()
export class ProgressCommandService {
  constructor(
    private readonly progressRepo: ProgressRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /** Record a progress entry (weight, body fat, etc.). */
  async recordProgressEntry(
    userId: string,
    dto: RecordProgressDto,
  ): Promise<ProgressEntryResponseDto> {
    const entry = await this.progressRepo.upsertEntry(userId, dto);

    this.eventEmitter.emit(DOMAIN_EVENTS.PROGRESS_ENTRY_RECORDED, {
      userId,
      metricType: dto.metricType,
      recordedValue: dto.recordedValue,
      recordedAt: dto.recordedAt,
    });

    return ProgressMapper.entryToResponse(entry);
  }

  /** Record a body measurement. */
  async recordMeasurement(
    userId: string,
    dto: RecordMeasurementDto,
  ): Promise<BodyMeasurementResponseDto> {
    const measurement = await this.progressRepo.upsertMeasurement(userId, dto);
    return ProgressMapper.measurementToResponse(measurement);
  }

  /** Save a progress photo. */
  async savePhoto(
    userId: string,
    data: {
      pose: string;
      storagePath: string;
      takenAt: string;
      notes?: string;
    },
  ): Promise<ProgressPhotoResponseDto> {
    const photo = await this.progressRepo.createPhoto(userId, {
      pose: data.pose,
      storagePath: data.storagePath,
      takenAt: new Date(data.takenAt),
      notes: data.notes,
    });
    return ProgressMapper.photoToResponse(photo);
  }

  /** Delete a progress photo after verifying ownership. */
  async deletePhoto(userId: string, photoId: string): Promise<string> {
    const photo = await this.progressRepo.findPhotoById(photoId);
    if (!photo) throw new NotFoundError('ProgressPhoto', photoId);
    if (photo.userId !== userId) {
      throw new AuthorizationError('You do not own this resource');
    }

    await this.progressRepo.deletePhoto(photoId);
    return photo.storagePath;
  }
}
