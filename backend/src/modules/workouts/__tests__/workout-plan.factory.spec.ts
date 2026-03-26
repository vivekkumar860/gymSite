import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutPlanFactory } from '../factories/workout-plan.factory';
import { EXERCISE_REPOSITORY } from '../../exercises/interfaces';
import type { IExerciseRepository } from '../../exercises/interfaces';
import type { ExerciseDomain } from '../../exercises/domain/exercise';
import type { GenerateWorkoutPlanDto } from '../dto/generate-workout-plan.dto';

function buildExercise(
  overrides: Partial<ExerciseDomain> = {},
): ExerciseDomain {
  return {
    id: 'ex-1',
    exerciseName: 'Bench Press',
    slug: 'bench-press',
    primaryMuscle: 'CHEST',
    secondaryMuscle: 'TRICEPS',
    equipment: 'BARBELL',
    difficulty: 'INTERMEDIATE',
    movementPattern: 'PUSH',
    instructions: null,
    videoUrl: null,
    isCompound: true,
    isActive: true,
    createdBy: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

const SAMPLE_EXERCISES: ExerciseDomain[] = [
  buildExercise({
    id: 'ex-1',
    exerciseName: 'Bench Press',
    primaryMuscle: 'CHEST',
    isCompound: true,
  }),
  buildExercise({
    id: 'ex-2',
    exerciseName: 'Incline DB Press',
    primaryMuscle: 'CHEST',
    equipment: 'DUMBBELL',
    isCompound: true,
  }),
  buildExercise({
    id: 'ex-3',
    exerciseName: 'Cable Fly',
    primaryMuscle: 'CHEST',
    equipment: 'CABLE',
    isCompound: false,
  }),
  buildExercise({
    id: 'ex-4',
    exerciseName: 'Barbell Row',
    primaryMuscle: 'BACK',
    isCompound: true,
  }),
  buildExercise({
    id: 'ex-5',
    exerciseName: 'Lat Pulldown',
    primaryMuscle: 'BACK',
    equipment: 'CABLE',
    isCompound: true,
  }),
  buildExercise({
    id: 'ex-6',
    exerciseName: 'Bicep Curl',
    primaryMuscle: 'BICEPS',
    equipment: 'DUMBBELL',
    isCompound: false,
  }),
  buildExercise({
    id: 'ex-7',
    exerciseName: 'Squat',
    primaryMuscle: 'QUADRICEPS',
    isCompound: true,
  }),
  buildExercise({
    id: 'ex-8',
    exerciseName: 'Leg Curl',
    primaryMuscle: 'HAMSTRINGS',
    equipment: 'MACHINE',
    isCompound: false,
  }),
  buildExercise({
    id: 'ex-9',
    exerciseName: 'Calf Raise',
    primaryMuscle: 'CALVES',
    equipment: 'MACHINE',
    isCompound: false,
  }),
  buildExercise({
    id: 'ex-10',
    exerciseName: 'OHP',
    primaryMuscle: 'SHOULDERS',
    isCompound: true,
  }),
  buildExercise({
    id: 'ex-11',
    exerciseName: 'Tricep Pushdown',
    primaryMuscle: 'TRICEPS',
    equipment: 'CABLE',
    isCompound: false,
  }),
];

describe('WorkoutPlanFactory', () => {
  let factory: WorkoutPlanFactory;
  let exerciseRepo: jest.Mocked<IExerciseRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutPlanFactory,
        {
          provide: EXERCISE_REPOSITORY,
          useValue: {
            findMany: jest
              .fn()
              .mockResolvedValue({
                data: SAMPLE_EXERCISES,
                totalCount: SAMPLE_EXERCISES.length,
              }),
            findById: jest.fn(),
            findBySlug: jest.fn(),
            slugExists: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            archive: jest.fn(),
          },
        },
      ],
    }).compile();

    factory = module.get(WorkoutPlanFactory);
    exerciseRepo = module.get(EXERCISE_REPOSITORY);
  });

  const baseDto: GenerateWorkoutPlanDto = {
    goal: 'GAIN_MUSCLE',
    experienceLevel: 'INTERMEDIATE',
    daysPerWeek: 3,
    durationWeeks: 8,
    sessionDurationMinutes: 60,
    availableEquipment: ['BARBELL', 'DUMBBELL', 'CABLE', 'MACHINE'],
    injuryRestrictions: [],
  };

  it('should produce a plan with correct number of days', async () => {
    const plan = await factory.createPlanBlueprint(baseDto);
    expect(plan.days).toHaveLength(3);
    expect(plan.daysPerWeek).toBe(3);
    expect(plan.durationWeeks).toBe(8);
  });

  it('should assign exercises to each day', async () => {
    const plan = await factory.createPlanBlueprint(baseDto);
    for (const day of plan.days) {
      expect(day.exercises.length).toBeGreaterThan(0);
    }
  });

  it('should use hypertrophy rep scheme for GAIN_MUSCLE', async () => {
    const plan = await factory.createPlanBlueprint(baseDto);
    const firstExercise = plan.days[0].exercises[0];
    expect(firstExercise.targetRepsMin).toBe(8);
    expect(firstExercise.targetRepsMax).toBe(12);
  });

  it('should use strength rep scheme for INCREASE_STRENGTH', async () => {
    const plan = await factory.createPlanBlueprint({
      ...baseDto,
      goal: 'INCREASE_STRENGTH',
    });
    const firstExercise = plan.days[0].exercises[0];
    expect(firstExercise.targetRepsMin).toBe(3);
    expect(firstExercise.targetRepsMax).toBe(5);
    expect(firstExercise.targetSets).toBe(5);
  });

  it('should filter exercises by available equipment', async () => {
    const plan = await factory.createPlanBlueprint({
      ...baseDto,
      availableEquipment: ['BODYWEIGHT'],
    });
    // With only bodyweight and no bodyweight exercises in our sample, days should have 0 exercises
    for (const day of plan.days) {
      expect(day.exercises).toHaveLength(0);
    }
  });

  it('should generate descriptive plan name', async () => {
    const plan = await factory.createPlanBlueprint(baseDto);
    expect(plan.planName).toContain('3-Day');
    expect(plan.planName).toContain('gain muscle');
  });

  it('should prioritize compound exercises', async () => {
    const plan = await factory.createPlanBlueprint(baseDto);
    const pushDay = plan.days.find(
      (d) => d.focusArea === 'Upper Body' || d.dayName.includes('Push'),
    );
    if (pushDay && pushDay.exercises.length > 1) {
      // First exercise should be compound (Bench Press)
      const firstEx = SAMPLE_EXERCISES.find(
        (e) => e.id === pushDay.exercises[0].exerciseId,
      );
      if (firstEx) {
        expect(firstEx.isCompound).toBe(true);
      }
    }
  });
});
