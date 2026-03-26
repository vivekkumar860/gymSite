import { Test, TestingModule } from '@nestjs/testing';
import { ProgressFacade } from '../facades/progress.facade';
import { ProgressRepository } from '../repositories/progress.repository';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { HabitService } from '../../habits/services/habit.service';
import type { WeeklySummaryResponseDto } from '../dto/progress-response.dto';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function daysAgo(n: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

function dateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ProgressFacade — getWeeklySummary', () => {
  let facade: ProgressFacade;
  let repo: jest.Mocked<ProgressRepository>;

  beforeEach(async () => {
    const mockRepo: Partial<jest.Mocked<ProgressRepository>> = {
      findCompletedWorkoutDates: jest.fn(),
      findDailyHabitStats: jest.fn(),
      countActiveDailyHabits: jest.fn(),
      getActivePlanDaysPerWeek: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressFacade,
        { provide: ProgressRepository, useValue: mockRepo },
        { provide: PrismaService, useValue: {} },
        { provide: HabitService, useValue: {} },
      ],
    }).compile();

    facade = module.get(ProgressFacade);
    repo = module.get(ProgressRepository);
  });

  it('returns 7 days with correct date range (today − 6 to today)', async () => {
    repo.findCompletedWorkoutDates.mockResolvedValue([]);
    repo.findDailyHabitStats.mockResolvedValue([]);
    repo.countActiveDailyHabits.mockResolvedValue(0);
    repo.getActivePlanDaysPerWeek.mockResolvedValue(null);

    const result: WeeklySummaryResponseDto =
      await facade.getWeeklySummary('user-1');

    expect(result.days).toHaveLength(7);

    // First day should be 6 days ago, last day should be today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expect(result.days[6].date).toBe(dateStr(today));
    expect(result.days[0].date).toBe(dateStr(daysAgo(6)));
  });

  it('marks days with completed workouts', async () => {
    const twoDaysAgo = daysAgo(2);
    const yesterday = daysAgo(1);

    repo.findCompletedWorkoutDates.mockResolvedValue([twoDaysAgo, yesterday]);
    repo.findDailyHabitStats.mockResolvedValue([]);
    repo.countActiveDailyHabits.mockResolvedValue(3);
    repo.getActivePlanDaysPerWeek.mockResolvedValue(4);

    const result = await facade.getWeeklySummary('user-1');

    const dayWithWorkout2 = result.days.find(
      (d) => d.date === dateStr(twoDaysAgo),
    );
    const dayWithWorkout1 = result.days.find(
      (d) => d.date === dateStr(yesterday),
    );
    const dayWithoutWorkout = result.days.find(
      (d) => d.date === dateStr(daysAgo(5)),
    );

    expect(dayWithWorkout2?.workoutCompleted).toBe(true);
    expect(dayWithWorkout1?.workoutCompleted).toBe(true);
    expect(dayWithoutWorkout?.workoutCompleted).toBe(false);

    expect(result.workoutsCompleted).toBe(2);
    expect(result.workoutsPlanned).toBe(4);
  });

  it('includes habit completion stats per day', async () => {
    const yesterday = daysAgo(1);

    repo.findCompletedWorkoutDates.mockResolvedValue([]);
    repo.findDailyHabitStats.mockResolvedValue([
      { date: yesterday, completed: 2 },
    ]);
    repo.countActiveDailyHabits.mockResolvedValue(5);
    repo.getActivePlanDaysPerWeek.mockResolvedValue(3);

    const result = await facade.getWeeklySummary('user-1');

    const yesterdayDay = result.days.find(
      (d) => d.date === dateStr(yesterday),
    );
    expect(yesterdayDay?.habitsCompleted).toBe(2);
    expect(yesterdayDay?.habitsTotal).toBe(5);

    // Days without entries should still have the total
    const emptyDay = result.days.find(
      (d) => d.date === dateStr(daysAgo(4)),
    );
    expect(emptyDay?.habitsCompleted).toBe(0);
    expect(emptyDay?.habitsTotal).toBe(5);
  });

  it('returns workoutsPlanned = 0 when no active plan exists', async () => {
    repo.findCompletedWorkoutDates.mockResolvedValue([]);
    repo.findDailyHabitStats.mockResolvedValue([]);
    repo.countActiveDailyHabits.mockResolvedValue(0);
    repo.getActivePlanDaysPerWeek.mockResolvedValue(null);

    const result = await facade.getWeeklySummary('user-1');

    expect(result.workoutsPlanned).toBe(0);
    expect(result.workoutsCompleted).toBe(0);
  });

  it('each day has a valid dayLabel (Mon, Tue, etc.)', async () => {
    repo.findCompletedWorkoutDates.mockResolvedValue([]);
    repo.findDailyHabitStats.mockResolvedValue([]);
    repo.countActiveDailyHabits.mockResolvedValue(0);
    repo.getActivePlanDaysPerWeek.mockResolvedValue(null);

    const result = await facade.getWeeklySummary('user-1');
    const validLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (const day of result.days) {
      expect(validLabels).toContain(day.dayLabel);
    }
  });
});
