import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { ProfileDomain } from '../domain/profile';
import { ProfileMapper } from '../mappers/profile.mapper';
import type { UpdateProfileDto } from '../dto/update-profile.dto';

/** Data access for user profiles. */
@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Find a profile by user ID. */
  async findByUserId(userId: string): Promise<ProfileDomain | null> {
    const record = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!record) return null;
    return ProfileMapper.toDomain(record);
  }

  /** Create a blank profile for a newly registered user. */
  async createForUser(userId: string): Promise<ProfileDomain> {
    const record = await this.prisma.profile.create({
      data: { userId },
    });

    return ProfileMapper.toDomain(record);
  }

  /** Update profile fields. Only provided fields are updated. */
  async update(userId: string, data: UpdateProfileDto): Promise<ProfileDomain> {
    const updateData: Record<string, unknown> = {};

    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.biologicalSex !== undefined)
      updateData.biologicalSex = data.biologicalSex;
    if (data.heightCm !== undefined) updateData.heightCm = data.heightCm;
    if (data.fitnessLevel !== undefined)
      updateData.fitnessLevel = data.fitnessLevel;
    if (data.dietaryPreference !== undefined)
      updateData.dietaryPreference = data.dietaryPreference;
    if (data.timezone !== undefined) updateData.timezone = data.timezone;
    if (data.dateOfBirth !== undefined)
      updateData.dateOfBirth = new Date(data.dateOfBirth);

    const record = await this.prisma.profile.update({
      where: { userId },
      data: updateData,
    });

    return ProfileMapper.toDomain(record);
  }
}
