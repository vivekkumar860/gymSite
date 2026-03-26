import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OnboardingService } from '../services/onboarding.service';
import { ZodValidationPipe } from '../../../common/pipes';
import { JwtAuthGuard } from '../../../common/guards';
import { CurrentUser } from '../../../common/decorators';
import { CompleteStepSchema } from '../dto/complete-step.dto';
import type { OnboardingResponseDto } from '../dto/onboarding-response.dto';

/** Handles onboarding flow endpoints. */
@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  /** Get the current user's onboarding status. */
  @Get('status')
  async getStatus(
    @CurrentUser() userId: string,
  ): Promise<OnboardingResponseDto> {
    return this.onboardingService.getStatus(userId);
  }

  /** Mark an onboarding step as completed. */
  @Post('complete-step')
  @HttpCode(HttpStatus.OK)
  async completeStep(
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(CompleteStepSchema)) dto: any,
  ): Promise<OnboardingResponseDto> {
    return this.onboardingService.completeStep(userId, dto.step);
  }
}
