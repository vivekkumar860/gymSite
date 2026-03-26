import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { AuthSessionDomain } from '../domain/auth-session';

/** Data access for refresh token sessions. */
@Injectable()
export class AuthSessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Create a new session with a refresh token. */
  async create(data: {
    userId: string;
    refreshToken: string;
    expiresAt: Date;
    deviceName?: string;
    ipAddress?: string;
  }): Promise<AuthSessionDomain> {
    const session = await this.prisma.authSession.create({ data });

    return this.toDomain(session);
  }

  /** Find an active (non-revoked, non-expired) session by refresh token. */
  async findActiveByToken(
    refreshToken: string,
  ): Promise<AuthSessionDomain | null> {
    const session = await this.prisma.authSession.findUnique({
      where: { refreshToken },
    });

    if (!session) return null;
    if (session.revokedAt) return null;
    if (session.expiresAt < new Date()) return null;

    return this.toDomain(session);
  }

  /** Revoke a single session by ID. */
  async revokeById(sessionId: string): Promise<void> {
    await this.prisma.authSession.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }

  /** Revoke all active sessions for a user (e.g., on password change). */
  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.authSession.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private toDomain(record: {
    id: string;
    userId: string;
    refreshToken: string;
    deviceName: string | null;
    ipAddress: string | null;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date;
  }): AuthSessionDomain {
    return {
      id: record.id,
      userId: record.userId,
      refreshToken: record.refreshToken,
      deviceName: record.deviceName,
      ipAddress: record.ipAddress,
      expiresAt: record.expiresAt,
      revokedAt: record.revokedAt,
      createdAt: record.createdAt,
    };
  }
}
