import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import type { PasswordResetTokenDomain } from '../domain/password-reset-token';

/** Data access for password reset tokens. */
@Injectable()
export class PasswordResetRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Create a new password reset token. */
  async create(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<PasswordResetTokenDomain> {
    const record = await this.prisma.passwordResetToken.create({ data });
    return this.toDomain(record);
  }

  /** Find a valid (unused, non-expired) token by its hash. */
  async findValidByHash(
    tokenHash: string,
  ): Promise<PasswordResetTokenDomain | null> {
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!record) return null;
    if (record.usedAt) return null;
    if (record.expiresAt < new Date()) return null;

    return this.toDomain(record);
  }

  /** Mark a token as used. */
  async markAsUsed(tokenId: string): Promise<void> {
    await this.prisma.passwordResetToken.update({
      where: { id: tokenId },
      data: { usedAt: new Date() },
    });
  }

  /** Invalidate all unused tokens for a user. */
  async invalidateAllForUser(userId: string): Promise<void> {
    await this.prisma.passwordResetToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    });
  }

  private toDomain(record: {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    usedAt: Date | null;
    createdAt: Date;
  }): PasswordResetTokenDomain {
    return {
      id: record.id,
      userId: record.userId,
      tokenHash: record.tokenHash,
      expiresAt: record.expiresAt,
      usedAt: record.usedAt,
      createdAt: record.createdAt,
    };
  }
}
