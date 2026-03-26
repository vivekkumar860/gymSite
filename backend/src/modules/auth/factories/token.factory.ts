import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import {
  ACCESS_TOKEN_EXPIRY_SECONDS,
  REFRESH_TOKEN_EXPIRY_DAYS,
} from '../../../common/constants';

/** Token pair returned after authentication. */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

/** Creates JWT access tokens and opaque refresh tokens. */
@Injectable()
export class TokenFactory {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /** Generate an access + refresh token pair for a user. */
  async createTokenPair(payload: {
    sub: string;
    email: string;
    role: string;
  }): Promise<TokenPair> {
    const accessToken = await this.createAccessToken(payload);
    const refreshToken = this.createRefreshToken();
    const refreshTokenExpiresAt = this.calculateRefreshExpiry();

    return { accessToken, refreshToken, refreshTokenExpiresAt };
  }

  private async createAccessToken(payload: {
    sub: string;
    email: string;
    role: string;
  }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: ACCESS_TOKEN_EXPIRY_SECONDS,
    });
  }

  private createRefreshToken(): string {
    return randomUUID();
  }

  private calculateRefreshExpiry(): Date {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
    return expiry;
  }
}
