import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { AuthUser } from '../domain/auth-user';
import { AuthUserMapper } from '../mappers/auth-user.mapper';

/** Data access for auth credentials and user identity lookups. */
@Injectable()
export class AuthCredentialRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Find a user with email credentials by email address. */
  async findUserByEmail(email: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { credentials: true },
    });

    if (!user) return null;
    return AuthUserMapper.toDomain(user);
  }

  /** Find a user with email credentials by username. */
  async findUserByUsername(username: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { credentials: true },
    });

    if (!user) return null;
    return AuthUserMapper.toDomain(user);
  }

  /** Find a user with email credentials by user ID. */
  async findUserById(userId: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { credentials: true },
    });

    if (!user) return null;
    return AuthUserMapper.toDomain(user);
  }

  /** Create a new user with email credentials in a single transaction. */
  async createUserWithCredentials(data: {
    username: string;
    email: string;
    passwordHash: string;
  }): Promise<AuthUser> {
    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        credentials: {
          create: {
            provider: 'EMAIL',
            passwordHash: data.passwordHash,
          },
        },
      },
      include: { credentials: true },
    });

    return AuthUserMapper.toDomain(user);
  }

  /** Update the password hash for a user's email credential. */
  async updatePasswordHash(
    userId: string,
    passwordHash: string,
  ): Promise<void> {
    await this.prisma.authCredential.updateMany({
      where: { userId, provider: 'EMAIL' },
      data: { passwordHash },
    });
  }

  /** Increment the failed login counter for a user's email credential. */
  async incrementFailedLogins(userId: string): Promise<void> {
    await this.prisma.authCredential.updateMany({
      where: { userId, provider: 'EMAIL' },
      data: { failedLoginCount: { increment: 1 } },
    });
  }

  /** Reset failed login counter and clear lockout. */
  async resetFailedLogins(userId: string): Promise<void> {
    await this.prisma.authCredential.updateMany({
      where: { userId, provider: 'EMAIL' },
      data: { failedLoginCount: 0, lockedUntil: null },
    });
  }

  /** Lock the account until a given timestamp. */
  async lockAccount(userId: string, lockedUntil: Date): Promise<void> {
    await this.prisma.authCredential.updateMany({
      where: { userId, provider: 'EMAIL' },
      data: { lockedUntil },
    });
  }
}
