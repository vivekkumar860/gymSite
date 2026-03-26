import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { ZodValidationPipe } from '../../../common/pipes';
import { JwtAuthGuard } from '../../../common/guards';
import { CurrentUser } from '../../../common/decorators';
import { UpdateProfileSchema } from '../dto/update-profile.dto';
import type { ProfileResponseDto } from '../dto/profile-response.dto';

/** Handles profile endpoints for the authenticated user. */
@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /** Get the current user's profile. */
  @Get('me')
  async getMyProfile(
    @CurrentUser() userId: string,
  ): Promise<ProfileResponseDto> {
    return this.profileService.getMyProfile(userId);
  }

  /** Update the current user's profile. */
  @Patch('me')
  @HttpCode(HttpStatus.OK)
  async updateMyProfile(
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(UpdateProfileSchema)) dto: any,
  ): Promise<ProfileResponseDto> {
    return this.profileService.updateMyProfile(userId, dto);
  }
}
