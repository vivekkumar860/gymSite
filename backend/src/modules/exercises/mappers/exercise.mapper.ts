import type { Exercise } from '@prisma/client';
import type { ExerciseDomain } from '../domain/exercise';
import type { ExerciseResponseDto } from '../dto/exercise-response.dto';

/** Maps between Prisma Exercise record, domain type, and response DTO. */
export class ExerciseMapper {
  /** Map a Prisma record to the domain type. */
  static toDomain(record: Exercise): ExerciseDomain {
    return {
      id: record.id,
      exerciseName: record.exerciseName,
      slug: record.slug,
      primaryMuscle: record.primaryMuscle,
      secondaryMuscle: record.secondaryMuscle,
      equipment: record.equipment,
      difficulty: record.difficulty,
      movementPattern: record.movementPattern,
      instructions: record.instructions,
      videoUrl: record.videoUrl,
      isCompound: record.isCompound,
      isActive: record.isActive,
      createdBy: record.createdBy,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  /** Map a domain exercise to the client response DTO. Internal fields stripped. */
  static toResponse(domain: ExerciseDomain): ExerciseResponseDto {
    return {
      id: domain.id,
      exerciseName: domain.exerciseName,
      slug: domain.slug,
      primaryMuscle: domain.primaryMuscle,
      secondaryMuscle: domain.secondaryMuscle,
      equipment: domain.equipment,
      difficulty: domain.difficulty,
      movementPattern: domain.movementPattern,
      instructions: domain.instructions,
      videoUrl: domain.videoUrl,
      isCompound: domain.isCompound,
      isActive: domain.isActive,
    };
  }
}
