import { WorkoutAnalyticsService } from '../services/workout-analytics.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

describe('WorkoutAnalyticsService', () => {
  let service: WorkoutAnalyticsService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prisma = {
      workoutSetLog: { findMany: jest.fn() },
      workoutSession: { findMany: jest.fn(), count: jest.fn() },
      nutritionPlan: { findFirst: jest.fn() },
      goal: { count: jest.fn() },
      habitDefinition: { count: jest.fn(), findMany: jest.fn() },
      habitEntry: { findMany: jest.fn() },
    } as any;

    service = new WorkoutAnalyticsService(prisma);
  });

  describe('getPersonalRecords', () => {
    it('should return empty array when no set logs exist', async () => {
      (prisma.workoutSetLog.findMany as jest.Mock).mockResolvedValue([]);
      const result = await service.getPersonalRecords('user-1');
      expect(result).toEqual([]);
    });

    it('should return PRs grouped by exercise', async () => {
      (prisma.workoutSetLog.findMany as jest.Mock).mockResolvedValue([
        {
          exerciseId: 'ex-1',
          weightKg: 100,
          repsCompleted: 5,
          isWarmup: false,
          createdAt: new Date('2026-01-15'),
          exercise: { id: 'ex-1', exerciseName: 'Bench Press' },
        },
        {
          exerciseId: 'ex-1',
          weightKg: 80,
          repsCompleted: 10,
          isWarmup: false,
          createdAt: new Date('2026-01-10'),
          exercise: { id: 'ex-1', exerciseName: 'Bench Press' },
        },
      ]);

      const result = await service.getPersonalRecords('user-1');
      expect(result).toHaveLength(1);
      expect(result[0].exerciseName).toBe('Bench Press');
      expect(result[0].maxWeight).toBe(100);
      expect(result[0].maxReps).toBe(10);
      expect(result[0].maxVolume).toBe(800); // 80 × 10
    });
  });

  describe('getVolumeByWeek', () => {
    it('should return correct number of weeks', async () => {
      (prisma.workoutSession.findMany as jest.Mock).mockResolvedValue([]);
      const result = await service.getVolumeByWeek('user-1', 8);
      expect(result).toHaveLength(8);
      result.forEach((week) => {
        expect(week.totalVolume).toBe(0);
        expect(week.workoutCount).toBe(0);
      });
    });
  });

  describe('getProgressSummary', () => {
    it('should return zeros when no data exists', async () => {
      (prisma.workoutSession.count as jest.Mock).mockResolvedValue(0);
      (prisma.workoutSetLog.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.workoutSession.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.getProgressSummary('user-1');
      expect(result.totalWorkouts).toBe(0);
      expect(result.totalVolume).toBe(0);
      expect(result.totalSets).toBe(0);
      expect(result.favoriteExercise).toBeNull();
    });
  });

  describe('getDashboardSummary', () => {
    it('should return summary with all fields', async () => {
      (prisma.workoutSession.count as jest.Mock).mockResolvedValue(3);
      (prisma.nutritionPlan.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.goal.count as jest.Mock).mockResolvedValue(2);
      (prisma.habitDefinition.count as jest.Mock).mockResolvedValue(5);
      (prisma.habitEntry.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.habitDefinition.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.workoutSession.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.getDashboardSummary('user-1');
      expect(result.weeklyWorkoutCount).toBe(3);
      expect(result.activeGoalsCount).toBe(2);
      expect(result.totalHabits).toBe(5);
      expect(result.recentWorkouts).toEqual([]);
    });
  });
});
