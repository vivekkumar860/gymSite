import {
  Controller,
  Delete,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from '../services/auth.service';
import { ZodValidationPipe } from '../../../common/pipes';
import { JwtAuthGuard } from '../../../common/guards';
import { CurrentUser } from '../../../common/decorators';
import { RegisterSchema } from '../dto/register.dto';
import { LoginSchema } from '../dto/login.dto';
import { RefreshTokenSchema } from '../dto/refresh-token.dto';
import { ForgotPasswordSchema } from '../dto/forgot-password.dto';
import { ResetPasswordSchema } from '../dto/reset-password.dto';
import type { AuthResponseDto } from '../dto/auth-response.dto';
import type { CurrentUserResponseDto } from '../dto/current-user-response.dto';

/** Handles authentication endpoints: register, login, password reset, me. */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Register a new user with email and password. */
  @Post('register')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body(new ZodValidationPipe(RegisterSchema)) dto: any,
  ): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  /** Authenticate with email and password. */
  @Post('login')
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ZodValidationPipe(LoginSchema)) dto: any,
  ): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  /** Get the currently authenticated user's profile. */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() userId: string): Promise<CurrentUserResponseDto> {
    return this.authService.getCurrentUser(userId);
  }

  /** Request a password reset email. Always returns 200 to prevent email enumeration. */
  @Post('forgot-password')
  @Throttle({ default: { ttl: 3600000, limit: 3 } })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body(new ZodValidationPipe(ForgotPasswordSchema)) dto: any,
  ): Promise<{ message: string }> {
    await this.authService.requestPasswordReset(dto.email);
    return {
      message: 'If that email is registered, a reset link has been sent',
    };
  }

  /** Reset password using a valid reset token. */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body(new ZodValidationPipe(ResetPasswordSchema)) dto: any,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(dto);
    return { message: 'Password has been reset successfully' };
  }

  /** Exchange a refresh token for a new token pair. */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body(new ZodValidationPipe(RefreshTokenSchema)) dto: any,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  /** Revoke the given refresh token. */
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Body(new ZodValidationPipe(RefreshTokenSchema)) dto: any,
  ): Promise<void> {
    await this.authService.logout(dto.refreshToken);
  }

  /** Revoke all sessions for the authenticated user. */
  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logoutAll(@CurrentUser() userId: string): Promise<void> {
    await this.authService.logoutAll(userId);
  }

  /** Deactivate the authenticated user's account. */
  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAccount(@CurrentUser() userId: string): Promise<void> {
    await this.authService.deactivateAccount(userId);
  }
}
