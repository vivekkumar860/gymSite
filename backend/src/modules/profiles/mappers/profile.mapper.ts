import { Profile } from '@prisma/client';
import { ProfileDomain } from '../domain/profile';
import { ProfileResponseDto } from '../dto/profile-response.dto';

/** Maps between Prisma Profile model, domain type, and response DTO. */
export class ProfileMapper {
  static toDomain(record: Profile): ProfileDomain {
    return {
      id: record.id,
      userId: record.userId,
      firstName: record.firstName,
      lastName: record.lastName,
      dateOfBirth: record.dateOfBirth,
      biologicalSex: record.biologicalSex,
      heightCm: record.heightCm ? Number(record.heightCm) : null,
      fitnessLevel: record.fitnessLevel,
      dietaryPreference: record.dietaryPreference,
      timezone: record.timezone,
      avatarUrl: record.avatarUrl,
    };
  }

  static toResponse(domain: ProfileDomain): ProfileResponseDto {
    return {
      id: domain.id,
      userId: domain.userId,
      firstName: domain.firstName,
      lastName: domain.lastName,
      dateOfBirth: domain.dateOfBirth?.toISOString().split('T')[0] ?? null,
      biologicalSex: domain.biologicalSex,
      heightCm: domain.heightCm,
      fitnessLevel: domain.fitnessLevel,
      dietaryPreference: domain.dietaryPreference,
      timezone: domain.timezone,
      avatarUrl: domain.avatarUrl,
    };
  }
}
