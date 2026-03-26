import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutFacade } from '../facades/workout.facade';
import { WorkoutPlanFactory } from '../factories/workout-plan.factory';
import { WORKOUT_PLAN_REPOSITORY } from '../interfaces';
import type { IWorkoutPlanRepository, GeneratedPlanData } from '../interfaces';
import type { GenerateWorkoutPlanDto } from '../dto/generate-workout-plan.dto';
import type { WorkoutPlanDomain } from '../domain/workout';

function buildPlan(
  overrides: Partial<WorkoutPlanDomain> = {},
): WorkoutPlanDomain {
  return {
    id: 'plan-1',
    userId: 'user-1',
    planName: '3-Day gain muscle plan',
    description: 'Generated plan',
    planStatus: 'ACTIVE',
    goalId: null,
    durationWeeks: 8,
    daysPerWeek: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('WorkoutFacade', () => {
  let facade: WorkoutFacade;
  let factory: jest.Mocked<WorkoutPlanFactory>;
  let planRepo: jest.Mocked<IWorkoutPlanRepository>;

  const blueprint: GeneratedPlanData = {
    planName: '3-Day gain muscle plan',
    description: 'Test plan',
    daysPerWeek: 3,
    durationWeeks: 8,
    days: [
      {
        dayName: 'Push',
        dayOrder: 1,
        focusArea: 'Push',
        exercises: [
          {
            exerciseId: 'ex-1',
            exerciseOrder: 1,
            targetSets: 4,
            targetRepsMin: 8,
            targetRepsMax: 12,
            restSeconds: 90,
          },
        ],
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutFacade,
        {
          provide: WorkoutPlanFactory,
          useValue: { createPlanBlueprint: jest.fn() },
        },
        {
          provide: WORKOUT_PLAN_REPOSITORY,
          useValue: {
            deactivateAllForUser: jest.fn(),
            createGeneratedPlan: jest.fn(),
            findById: jest.fn(),
            findByUserId: jest.fn(),
            findActivePlanByUserId: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    facade = module.get(WorkoutFacade);
    factory = module.get(WorkoutPlanFactory);
    planRepo = module.get(WORKOUT_PLAN_REPOSITORY);
  });

  const dto: GenerateWorkoutPlanDto = {
    goal: 'GAIN_MUSCLE',
    experienceLevel: 'INTERMEDIATE',
    daysPerWeek: 3,
    durationWeeks: 8,
    sessionDurationMinutes: 60,
    availableEquipment: ['BARBELL', 'DUMBBELL'],
    injuryRestrictions: [],
  };

  it('should orchestrate: factory → deactivate → persist', async () => {
    factory.createPlanBlueprint.mockResolvedValue(blueprint);
    planRepo.createGeneratedPlan.mockResolvedValue(buildPlan());

    const result = await facade.generatePlan('user-1', dto);

    expect(factory.createPlanBlueprint).toHaveBeenCalledWith(dto);
    expect(planRepo.deactivateAllForUser).toHaveBeenCalledWith('user-1');
    expect(planRepo.createGeneratedPlan).toHaveBeenCalledWith(
      'user-1',
      blueprint,
    );
    expect(result.planStatus).toBe('ACTIVE');
  });

  it('should deactivate old plans before creating new one', async () => {
    factory.createPlanBlueprint.mockResolvedValue(blueprint);
    planRepo.createGeneratedPlan.mockResolvedValue(buildPlan());

    await facade.generatePlan('user-1', dto);

    const deactivateOrder =
      planRepo.deactivateAllForUser.mock.invocationCallOrder[0];
    const createOrder =
      planRepo.createGeneratedPlan.mock.invocationCallOrder[0];
    expect(deactivateOrder).toBeLessThan(createOrder);
  });

  it('should return a plan response DTO (not domain)', async () => {
    factory.createPlanBlueprint.mockResolvedValue(blueprint);
    planRepo.createGeneratedPlan.mockResolvedValue(buildPlan());

    const result = await facade.generatePlan('user-1', dto);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('planName');
    expect(result).toHaveProperty('createdAt');
    expect(typeof result.createdAt).toBe('string');
    expect(result).not.toHaveProperty('userId');
  });
});
