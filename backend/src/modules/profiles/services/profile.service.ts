import { Injectable } from '@nestjs/common';
import { ProfileRepository } from '../repositories/profile.repository';
import { ProfileMapper } from '../mappers/profile.mapper';
import { NotFoundError } from '../../../common/errors';
import type { UpdateProfileDto } from '../dto/update-profile.dto';
import type { ProfileResponseDto } from '../dto/profile-response.dto';

/** Business logic for user profiles. */
@Injectable()
export class ProfileService {
  constructor(private readonly profileRepo: ProfileRepository) {}

  /** Get the profile for an authenticated user. */
  async getMyProfile(userId: string): Promise<ProfileResponseDto> {
    const profile = await this.profileRepo.findByUserId(userId);

    if (!profile) {
      throw new NotFoundError('Profile', userId);
    }

    return ProfileMapper.toResponse(profile);
  }

  /** Update the profile for an authenticated user. */
  async updateMyProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const existing = await this.profileRepo.findByUserId(userId);

    if (!existing) {
      throw new NotFoundError('Profile', userId);
    }

    const updated = await this.profileRepo.update(userId, dto);
    return ProfileMapper.toResponse(updated);
  }

  /** Create a blank profile for a newly registered user. */
  async createBlankProfile(userId: string): Promise<void> {
    await this.profileRepo.createForUser(userId);
  }
}
