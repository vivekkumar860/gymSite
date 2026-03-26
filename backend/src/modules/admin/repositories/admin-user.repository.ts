import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import type {
  AdminUserListDto,
  AdminUserDetailDto,
  AdminUserFilterDto,
} from '../dto/admin-user.dto';

/** Data access for admin user management. */
@Injectable()
export class AdminUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Paginated user list with filters. */
  async findMany(
    filter: AdminUserFilterDto,
  ): Promise<{ data: AdminUserListDto[]; totalCount: number }> {
    const where = this.buildWhere(filter);
    const skip = (filter.page - 1) * filter.limit;

    const [records, totalCount] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: filter.limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: records.map((r) => ({
        id: r.id,
        username: r.username,
        email: r.email,
        role: r.role,
        accountStatus: r.accountStatus,
        createdAt: r.createdAt.toISOString(),
      })),
      totalCount,
    };
  }

  /** Get a single user with profile and activity stats. */
  async findDetailById(id: string): Promise<AdminUserDetailDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
            fitnessLevel: true,
            dietaryPreference: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            workoutSessions: true,
            goals: true,
            habitDefinitions: true,
          },
        },
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      accountStatus: user.accountStatus,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      profile: user.profile
        ? {
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
            fitnessLevel: user.profile.fitnessLevel,
            dietaryPreference: user.profile.dietaryPreference,
            avatarUrl: user.profile.avatarUrl,
          }
        : null,
      stats: {
        totalWorkoutSessions: user._count.workoutSessions,
        totalGoals: user._count.goals,
        totalHabits: user._count.habitDefinitions,
      },
    };
  }

  /** Update account status. */
  async updateStatus(userId: string, status: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { accountStatus: status as any },
    });
  }

  /** Update user role. */
  async updateRole(userId: string, role: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
    });
  }

  /** Get a user's current status and role (for audit diffs). */
  async findBasicById(
    userId: string,
  ): Promise<{ role: string; accountStatus: string } | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, accountStatus: true },
    });
  }

  private buildWhere(filter: AdminUserFilterDto): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {};
    if (filter.role) where.role = filter.role;
    if (filter.accountStatus) where.accountStatus = filter.accountStatus;
    if (filter.search) {
      where.OR = [
        { username: { contains: filter.search, mode: 'insensitive' } },
        { email: { contains: filter.search, mode: 'insensitive' } },
      ];
    }
    return where;
  }
}
