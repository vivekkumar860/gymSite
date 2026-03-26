import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { ProgressRepository } from '../repositories/progress.repository';
import { HabitService } from '../../habits/services/habit.service';
import type {
  ProgressSummaryResponseDto,
  WeeklySummaryResponseDto,
  WeeklyDayStatusDto,
} from '../dto/progress-response.dto';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

/**
 * Aggregates progress data from multiple modules into a unified summary.
 * Uses PrismaService for read-only cross-module counts (same pattern as AdminDashboardFacade).
 * Delegates streak calculation to HabitService to avoid logic duplication.
 */
@Injectable()
export class ProgressFacade {
  constructor(
    private readonly prisma: PrismaService,
    private readonly progressRepo: ProgressRepository,
    private readonly habitService: HabitService,
  ) {}

  /** Build a progress summary for a user's dashboard. */
  async getSummary(userId: string): Promise<ProgressSummaryResponseDto> {
    const [totalWorkouts, latestWeight, activeGoalsCount, streaks] =
      await Promise.all([
        this.countCompletedWorkouts(userId),
        this.getLatestBodyWeight(userId),
        this.countActiveGoals(userId),
        this.getTopHabitStreaks(userId),
      ]);

    return {
      totalWorkouts,
      latestBodyWeight: latestWeight,
      activeGoalsCount,
      currentHabitStreaks: streaks,
    };
  }

  /** Build a 7-day weekly overview for the dashboard. */
  async getWeeklySummary(userId: string): Promise<WeeklySummaryResponseDto> {
    const { from, to, dates } = this.buildWeekRange();

    const [workoutDates, habitStats, totalDailyHabits, daysPerWeek] =
      await Promise.all([
        this.progressRepo.findCompletedWorkoutDates(userId, from, to),
        this.progressRepo.findDailyHabitStats(userId, from, to),
        this.progressRepo.countActiveDailyHabits(userId),
        this.progressRepo.getActivePlanDaysPerWeek(userId),
      ]);

    const workoutDateSet = new Set(
      workoutDates.map((d) => d.toISOString().split('T')[0]),
    );

    const habitStatsByDate = new Map(
      habitStats.map((s) => [s.date.toISOString().split('T')[0], s.completed]),
    );

    const days: WeeklyDayStatusDto[] = dates.map((d) => {
      const dateStr = d.toISOString().split('T')[0];
      return {
        date: dateStr,
        dayLabel: DAY_LABELS[d.getDay()],
        workoutCompleted: workoutDateSet.has(dateStr),
        habitsCompleted: habitStatsByDate.get(dateStr) ?? 0,
        habitsTotal: totalDailyHabits,
      };
    });

    const workoutsCompleted = days.filter((d) => d.workoutCompleted).length;

    return {
      days,
      workoutsCompleted,
      workoutsPlanned: daysPerWeek ?? 0,
    };
  }

  /** Build the date range for the current week (today − 6 days → today). */
  private buildWeekRange(): { from: Date; to: Date; dates: Date[] } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const from = new Date(today);
    from.setDate(from.getDate() - 6);

    const to = new Date(today);
    to.setHours(23, 59, 59, 999);

    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(from);
      d.setDate(d.getDate() + i);
      dates.push(d);
    }

    return { from, to, dates };
  }

  private async countCompletedWorkouts(userId: string): Promise<number> {
    return this.prisma.workoutSession.count({
      where: { userId, sessionStatus: 'COMPLETED' },
    });
  }

  private async getLatestBodyWeight(userId: string): Promise<number | null> {
    const entry = await this.progressRepo.findLatestEntry(
      userId,
      'BODY_WEIGHT',
    );
    return entry?.recordedValue ?? null;
  }

  private async countActiveGoals(userId: string): Promise<number> {
    return this.prisma.goal.count({
      where: { userId, goalStatus: 'ACTIVE' },
    });
  }

  private async getTopHabitStreaks(
    userId: string,
  ): Promise<{ habitName: string; streak: number }[]> {
    const habits = await this.habitService.getUserHabits(userId);

    return habits
      .filter((h) => h.currentStreak > 0)
      .map((h) => ({ habitName: h.habitName, streak: h.currentStreak }))
      .sort((a, b) => b.streak - a.streak);
  }
}
