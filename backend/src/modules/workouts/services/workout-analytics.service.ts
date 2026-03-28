import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

export interface PersonalRecordDto {
  exerciseId: string;
  exerciseName: string;
  maxWeight: number;
  maxReps: number;
  maxVolume: number;
  achievedAt: string;
}

export interface WeeklyVolumeDto {
  weekStart: string;
  totalVolume: number;
  workoutCount: number;
}

export interface ProgressSummaryDto {
  totalWorkouts: number;
  totalVolume: number;
  totalSets: number;
  currentStreak: number;
  longestStreak: number;
  favoriteExercise: string | null;
  muscleGroupDistribution: Array<{ muscle: string; setCount: number }>;
}

export interface DashboardSummaryDto {
  weeklyWorkoutCount: number;
  activePlanName: string | null;
  todayCalorieTarget: number | null;
  activeGoalsCount: number;
  habitsCompletedToday: number;
  totalHabits: number;
  longestCurrentStreak: number;
  recentWorkouts: Array<{
    id: string;
    name: string;
    completedAt: string;
    totalSets: number;
    totalVolume: number;
  }>;
}

@Injectable()
export class WorkoutAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPersonalRecords(userId: string): Promise<PersonalRecordDto[]> {
    const sets = await this.prisma.workoutSetLog.findMany({
      where: {
        session: { userId, sessionStatus: 'COMPLETED' },
        isWarmup: false,
      },
      include: { exercise: { select: { id: true, exerciseName: true } } },
    });

    const byExercise = new Map<string, { exerciseName: string; maxWeight: number; maxReps: number; maxVolume: number; achievedAt: Date }>();

    for (const set of sets) {
      const weight = set.weightKg ? Number(set.weightKg) : 0;
      const volume = weight * set.repsCompleted;
      const existing = byExercise.get(set.exerciseId);

      if (!existing) {
        byExercise.set(set.exerciseId, {
          exerciseName: set.exercise.exerciseName,
          maxWeight: weight,
          maxReps: set.repsCompleted,
          maxVolume: volume,
          achievedAt: set.createdAt,
        });
      } else {
        if (weight > existing.maxWeight) existing.maxWeight = weight;
        if (set.repsCompleted > existing.maxReps) existing.maxReps = set.repsCompleted;
        if (volume > existing.maxVolume) {
          existing.maxVolume = volume;
          existing.achievedAt = set.createdAt;
        }
      }
    }

    return Array.from(byExercise.entries()).map(([exerciseId, data]) => ({
      exerciseId,
      exerciseName: data.exerciseName,
      maxWeight: data.maxWeight,
      maxReps: data.maxReps,
      maxVolume: data.maxVolume,
      achievedAt: data.achievedAt.toISOString(),
    }));
  }

  async getVolumeByWeek(userId: string, weeks: number): Promise<WeeklyVolumeDto[]> {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - weeks * 7);

    const sessions = await this.prisma.workoutSession.findMany({
      where: {
        userId,
        sessionStatus: 'COMPLETED',
        completedAt: { gte: startDate },
      },
      include: { setLogs: true },
    });

    const weekMap = new Map<string, { totalVolume: number; sessionIds: Set<string> }>();

    // Pre-fill weeks
    for (let i = 0; i < weeks; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (weeks - 1 - i) * 7);
      const day = weekStart.getDay();
      const mondayOffset = day === 0 ? -6 : 1 - day;
      weekStart.setDate(weekStart.getDate() + mondayOffset);
      const key = weekStart.toISOString().split('T')[0];
      weekMap.set(key, { totalVolume: 0, sessionIds: new Set() });
    }

    for (const session of sessions) {
      const completed = session.completedAt ?? session.startedAt;
      const date = new Date(completed);
      const day = date.getDay();
      const mondayOffset = day === 0 ? -6 : 1 - day;
      date.setDate(date.getDate() + mondayOffset);
      const weekKey = date.toISOString().split('T')[0];

      const entry = weekMap.get(weekKey);
      if (entry) {
        entry.sessionIds.add(session.id);
        for (const set of session.setLogs) {
          const weight = set.weightKg ? Number(set.weightKg) : 0;
          entry.totalVolume += weight * set.repsCompleted;
        }
      }
    }

    return Array.from(weekMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([weekStart, data]) => ({
        weekStart,
        totalVolume: Math.round(data.totalVolume),
        workoutCount: data.sessionIds.size,
      }));
  }

  async getProgressSummary(userId: string): Promise<ProgressSummaryDto> {
    const [sessionCount, setLogs] = await Promise.all([
      this.prisma.workoutSession.count({
        where: { userId, sessionStatus: 'COMPLETED' },
      }),
      this.prisma.workoutSetLog.findMany({
        where: { session: { userId, sessionStatus: 'COMPLETED' } },
        include: { exercise: { select: { exerciseName: true, primaryMuscle: true } } },
      }),
    ]);

    let totalVolume = 0;
    const exerciseCounts = new Map<string, number>();
    const muscleCounts = new Map<string, number>();

    for (const set of setLogs) {
      const weight = set.weightKg ? Number(set.weightKg) : 0;
      totalVolume += weight * set.repsCompleted;

      exerciseCounts.set(
        set.exercise.exerciseName,
        (exerciseCounts.get(set.exercise.exerciseName) ?? 0) + 1,
      );
      muscleCounts.set(
        set.exercise.primaryMuscle,
        (muscleCounts.get(set.exercise.primaryMuscle) ?? 0) + 1,
      );
    }

    let favoriteExercise: string | null = null;
    let maxCount = 0;
    for (const [name, count] of exerciseCounts) {
      if (count > maxCount) { maxCount = count; favoriteExercise = name; }
    }

    const muscleGroupDistribution = Array.from(muscleCounts.entries())
      .map(([muscle, setCount]) => ({ muscle, setCount }))
      .sort((a, b) => b.setCount - a.setCount)
      .slice(0, 6);

    // Streak calculation
    const completedDates = await this.prisma.workoutSession.findMany({
      where: { userId, sessionStatus: 'COMPLETED' },
      select: { completedAt: true },
      orderBy: { completedAt: 'desc' },
    });

    const dateSet = new Set(
      completedDates
        .filter((s) => s.completedAt)
        .map((s) => s.completedAt!.toISOString().split('T')[0]),
    );

    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      if (dateSet.has(key)) {
        streak++;
        if (streak > longestStreak) longestStreak = streak;
        if (i <= 1) currentStreak = streak;
      } else {
        if (i > 0 && currentStreak === 0) currentStreak = 0;
        streak = 0;
      }
    }

    return {
      totalWorkouts: sessionCount,
      totalVolume: Math.round(totalVolume),
      totalSets: setLogs.length,
      currentStreak,
      longestStreak,
      favoriteExercise,
      muscleGroupDistribution,
    };
  }

  async getDashboardSummary(userId: string): Promise<DashboardSummaryDto> {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    weekStart.setHours(0, 0, 0, 0);

    const [
      weeklyWorkouts,
      activePlan,
      activeGoalsCount,
      totalHabits,
      todayHabitEntries,
      _habitsForStreak,
      recentSessions,
    ] = await Promise.all([
      this.prisma.workoutSession.count({
        where: { userId, sessionStatus: 'COMPLETED', completedAt: { gte: weekStart } },
      }),
      this.prisma.nutritionPlan.findFirst({
        where: { userId, isActive: true },
        select: { planName: true, dailyCalories: true },
      }),
      this.prisma.goal.count({
        where: { userId, goalStatus: 'ACTIVE' },
      }),
      this.prisma.habitDefinition.count({
        where: { userId, isActive: true },
      }),
      this.prisma.habitEntry.findMany({
        where: {
          habit: { userId },
          entryDate: now.toISOString().split('T')[0],
          isCompleted: true,
        },
      }),
      this.prisma.habitDefinition.findMany({
        where: { userId, isActive: true },
        select: { id: true },
      }),
      this.prisma.workoutSession.findMany({
        where: { userId, sessionStatus: 'COMPLETED' },
        orderBy: { completedAt: 'desc' },
        take: 5,
        include: { setLogs: true, day: { select: { dayName: true } } },
      }),
    ]);

    // Compute the longest current streak across all active habits
    let longestCurrentStreak = 0;
    if (_habitsForStreak.length > 0) {
      const habitIds = _habitsForStreak.map((h) => h.id);
      const entries = await this.prisma.habitEntry.findMany({
        where: { habitId: { in: habitIds }, isCompleted: true },
        select: { habitId: true, entryDate: true },
        orderBy: { entryDate: 'desc' },
      });
      // Group entries by habitId and compute per-habit streak
      const byHabit = new Map<string, string[]>();
      for (const e of entries) {
        const dateStr = typeof e.entryDate === 'string'
          ? e.entryDate
          : new Date(e.entryDate).toISOString().split('T')[0];
        const arr = byHabit.get(e.habitId) ?? [];
        arr.push(dateStr);
        byHabit.set(e.habitId, arr);
      }
      const todayStr = new Date().toISOString().split('T')[0];
      for (const dates of byHabit.values()) {
        const unique = [...new Set(dates)].sort().reverse();
        let streak = 0;
        for (let i = 0; i < unique.length; i++) {
          const expected = new Date();
          expected.setDate(expected.getDate() - i);
          const expectedStr = expected.toISOString().split('T')[0];
          if (unique[i] === expectedStr || (i === 0 && unique[i] === todayStr)) {
            streak++;
          } else break;
        }
        if (streak > longestCurrentStreak) longestCurrentStreak = streak;
      }
    }

    const recentWorkouts = recentSessions.map((s) => {
      let totalVolume = 0;
      for (const set of s.setLogs) {
        totalVolume += (set.weightKg ? Number(set.weightKg) : 0) * set.repsCompleted;
      }
      return {
        id: s.id,
        name: s.day?.dayName ?? 'Workout Session',
        completedAt: (s.completedAt ?? s.startedAt).toISOString(),
        totalSets: s.setLogs.length,
        totalVolume: Math.round(totalVolume),
      };
    });

    return {
      weeklyWorkoutCount: weeklyWorkouts,
      activePlanName: activePlan?.planName ?? null,
      todayCalorieTarget: activePlan?.dailyCalories ?? null,
      activeGoalsCount,
      habitsCompletedToday: todayHabitEntries.length,
      totalHabits,
      longestCurrentStreak,
      recentWorkouts,
    };
  }
}
