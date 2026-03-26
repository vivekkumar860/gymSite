import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import type { AdminDashboardDto } from '../dto/admin-dashboard.dto';

/**
 * Aggregates platform-wide stats for the admin dashboard.
 * Hides multi-table query complexity behind a single method.
 */
@Injectable()
export class AdminDashboardFacade {
  constructor(private readonly prisma: PrismaService) {}

  /** Build the admin dashboard summary. */
  async getDashboard(): Promise<AdminDashboardDto> {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalExercises,
      totalWorkoutSessions,
      totalGoals,
      newUsersToday,
      newUsersThisWeek,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { accountStatus: 'ACTIVE' } }),
      this.prisma.user.count({ where: { accountStatus: 'SUSPENDED' } }),
      this.prisma.exercise.count({ where: { isActive: true } }),
      this.prisma.workoutSession.count({
        where: { sessionStatus: 'COMPLETED' },
      }),
      this.prisma.goal.count({ where: { goalStatus: 'ACTIVE' } }),
      this.prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
      this.prisma.user.count({ where: { createdAt: { gte: startOfWeek } } }),
    ]);

    return {
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalExercises,
      totalWorkoutSessions,
      totalGoals,
      newUsersToday,
      newUsersThisWeek,
    };
  }
}
