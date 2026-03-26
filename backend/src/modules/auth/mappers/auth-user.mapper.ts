import { User, AuthCredential } from '@prisma/client';
import { AuthUser } from '../domain/auth-user';
import type { CurrentUserResponseDto } from '../dto/current-user-response.dto';

type UserWithCredential = User & { credentials: AuthCredential[] };

/** Maps Prisma User + AuthCredential records to domain and response types. */
export class AuthUserMapper {
  /** Map Prisma record to auth domain type (includes sensitive fields). */
  static toDomain(record: UserWithCredential): AuthUser {
    const emailCredential = record.credentials.find(
      (c) => c.provider === 'EMAIL',
    );

    return {
      id: record.id,
      username: record.username,
      email: record.email,
      role: record.role,
      accountStatus: record.accountStatus,
      passwordHash: emailCredential?.passwordHash ?? null,
      emailVerifiedAt: emailCredential?.emailVerifiedAt ?? null,
      failedLoginCount: emailCredential?.failedLoginCount ?? 0,
      lockedUntil: emailCredential?.lockedUntil ?? null,
      createdAt: record.createdAt,
    };
  }

  /** Map domain user to a safe response for the /me endpoint. No password hash leaked. */
  static toCurrentUserResponse(user: AuthUser): CurrentUserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      accountStatus: user.accountStatus,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
