import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WorkoutSessionService } from '../services/workout-session.service';
import { WORKOUT_SESSION_REPOSITORY } from '../interfaces';
import type { IWorkoutSessionRepository } from '../interfaces';
import type { WorkoutSessionDomain, WorkoutSetLogDomain } from '../domain/workout';

function buildSession(
  overrides: Partial<WorkoutSessionDomain> = {},
): WorkoutSessionDomain {
  return {
    id: 'session-1',
    userId: 'user-1',
    dayId: 'day-1',
    sessionStatus: 'IN_PROGRESS',
    startedAt: new Date(),
    completedAt: null,
    notes: null,
    rating: null,
    ...overrides,
  };
}

function buildSetLog(
  overrides: Partial<WorkoutSetLogDomain> = {},
): WorkoutSetLogDomain {
  return {
    id: 'set-1',
    sessionId: 'session-1',
    exerciseId: 'ex-1',
    setNumber: 1,
    weightKg: 60,
    repsCompleted: 10,
    rpe: 7,
    isWarmup: false,
    isFailure: false,
    ...overrides,
  };
}

describe('WorkoutSessionService.deleteSet', () => {
  let service: WorkoutSessionService;
  let sessionRepo: jest.Mocked<IWorkoutSessionRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutSessionService,
        {
          provide: WORKOUT_SESSION_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            findSetById: jest.fn(),
            deleteSet: jest.fn(),
          } as Partial<jest.Mocked<IWorkoutSessionRepository>>,
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(WorkoutSessionService);
    sessionRepo = module.get(WORKOUT_SESSION_REPOSITORY);
  });

  it('deletes a set from an in-progress session owned by the user', async () => {
    sessionRepo.findById.mockResolvedValue(buildSession());
    sessionRepo.findSetById.mockResolvedValue(buildSetLog());
    sessionRepo.deleteSet.mockResolvedValue(undefined);

    await expect(
      service.deleteSet('session-1', 'set-1', 'user-1'),
    ).resolves.toBeUndefined();

    expect(sessionRepo.deleteSet).toHaveBeenCalledWith('set-1');
  });

  it('throws NotFoundError when session does not exist', async () => {
    sessionRepo.findById.mockResolvedValue(null);

    await expect(
      service.deleteSet('session-bad', 'set-1', 'user-1'),
    ).rejects.toThrow('WorkoutSession');
  });

  it('throws AuthorizationError when user does not own the session', async () => {
    sessionRepo.findById.mockResolvedValue(
      buildSession({ userId: 'other-user' }),
    );

    await expect(
      service.deleteSet('session-1', 'set-1', 'user-1'),
    ).rejects.toThrow('You do not own this resource');
  });

  it('throws when session is not in progress', async () => {
    sessionRepo.findById.mockResolvedValue(
      buildSession({ sessionStatus: 'COMPLETED' }),
    );

    await expect(
      service.deleteSet('session-1', 'set-1', 'user-1'),
    ).rejects.toThrow('Session is not in progress');
  });

  it('throws NotFoundError when set does not exist', async () => {
    sessionRepo.findById.mockResolvedValue(buildSession());
    sessionRepo.findSetById.mockResolvedValue(null);

    await expect(
      service.deleteSet('session-1', 'set-bad', 'user-1'),
    ).rejects.toThrow('WorkoutSetLog');
  });

  it('throws NotFoundError when set belongs to a different session', async () => {
    sessionRepo.findById.mockResolvedValue(buildSession());
    sessionRepo.findSetById.mockResolvedValue(
      buildSetLog({ sessionId: 'other-session' }),
    );

    await expect(
      service.deleteSet('session-1', 'set-1', 'user-1'),
    ).rejects.toThrow('WorkoutSetLog');
  });
});
