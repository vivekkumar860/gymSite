import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseService } from '../services/exercise.service';
import { EXERCISE_REPOSITORY } from '../interfaces';
import { NotFoundError } from '../../../common/errors';
import type { IExerciseRepository } from '../interfaces';
import type { ExerciseDomain } from '../domain/exercise';
import type { CreateExerciseDto } from '../dto/create-exercise.dto';

// ── Fixtures ─────────────────────────────────────────────

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
    instructions: 'Lie flat on bench, press bar up.',
    videoUrl: null,
    isCompound: true,
    isActive: true,
    createdBy: 'user-1',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    ...overrides,
  };
}

// ── Test suite ───────────────────────────────────────────

describe('ExerciseService', () => {
  let service: ExerciseService;
  let repo: jest.Mocked<IExerciseRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExerciseService,
        {
          provide: EXERCISE_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            findBySlug: jest.fn(),
            findMany: jest.fn(),
            findManyAdmin: jest.fn(),
            slugExists: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            archive: jest.fn(),
            unarchive: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ExerciseService);
    repo = module.get(EXERCISE_REPOSITORY);
  });

  // ── getExerciseBySlug ────────────────────────────────

  describe('getExerciseBySlug', () => {
    it('should return the exercise when found by slug', async () => {
      repo.findBySlug.mockResolvedValue(buildExercise());

      const result = await service.getExerciseBySlug('bench-press');

      expect(result.slug).toBe('bench-press');
      expect(result.exerciseName).toBe('Bench Press');
      expect(repo.findBySlug).toHaveBeenCalledWith('bench-press');
    });

    it('should throw NotFoundError when slug does not exist', async () => {
      repo.findBySlug.mockResolvedValue(null);

      await expect(service.getExerciseBySlug('nonexistent')).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should not expose createdBy in response', async () => {
      repo.findBySlug.mockResolvedValue(buildExercise());

      const result = await service.getExerciseBySlug('bench-press');

      expect(result).not.toHaveProperty('createdBy');
      expect(result).not.toHaveProperty('createdAt');
      expect(result).not.toHaveProperty('updatedAt');
    });
  });

  // ── listExercises ────────────────────────────────────

  describe('listExercises', () => {
    it('should return paginated results', async () => {
      repo.findMany.mockResolvedValue({
        data: [buildExercise()],
        totalCount: 1,
      });

      const result = await service.listExercises({ page: 1, limit: 20 } as any);

      expect(result.data).toHaveLength(1);
      expect(result.meta.totalCount).toBe(1);
      expect(result.meta.totalPages).toBe(1);
      expect(result.meta.page).toBe(1);
    });

    it('should calculate totalPages correctly with remainder', async () => {
      repo.findMany.mockResolvedValue({ data: [], totalCount: 55 });

      const result = await service.listExercises({ page: 1, limit: 20 } as any);

      expect(result.meta.totalPages).toBe(3);
    });

    it('should pass filter through to repository', async () => {
      repo.findMany.mockResolvedValue({ data: [], totalCount: 0 });

      const filter = {
        page: 1,
        limit: 20,
        primaryMuscle: 'CHEST',
        movementPattern: 'PUSH',
      };
      await service.listExercises(filter as any);

      expect(repo.findMany).toHaveBeenCalledWith(filter);
    });
  });

  // ── createExercise ───────────────────────────────────

  describe('createExercise', () => {
    const dto: CreateExerciseDto = {
      exerciseName: 'Bench Press',
      primaryMuscle: 'CHEST',
      equipment: 'BARBELL',
      difficulty: 'INTERMEDIATE',
      movementPattern: 'PUSH',
      isCompound: true,
    };

    it('should create exercise with generated slug', async () => {
      repo.slugExists.mockResolvedValue(false);
      repo.create.mockResolvedValue(buildExercise());

      const result = await service.createExercise(dto, 'user-1');

      expect(result.exerciseName).toBe('Bench Press');
      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ slug: 'bench-press' }),
        'user-1',
      );
    });

    it('should append suffix when slug already exists', async () => {
      repo.slugExists
        .mockResolvedValueOnce(true) // "bench-press" exists
        .mockResolvedValueOnce(false); // "bench-press-2" available
      repo.create.mockResolvedValue(buildExercise({ slug: 'bench-press-2' }));

      await service.createExercise(dto, 'user-1');

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ slug: 'bench-press-2' }),
        'user-1',
      );
    });
  });

  // ── updateExercise ───────────────────────────────────

  describe('updateExercise', () => {
    it('should update and return the exercise', async () => {
      const updated = buildExercise({
        exerciseName: 'Incline Bench Press',
        slug: 'incline-bench-press',
      });
      repo.findById.mockResolvedValue(buildExercise());
      repo.slugExists.mockResolvedValue(false);
      repo.update.mockResolvedValue(updated);

      const result = await service.updateExercise('ex-1', {
        exerciseName: 'Incline Bench Press',
      });

      expect(result.exerciseName).toBe('Incline Bench Press');
    });

    it('should regenerate slug when name changes', async () => {
      repo.findById.mockResolvedValue(buildExercise());
      repo.slugExists.mockResolvedValue(false);
      repo.update.mockResolvedValue(buildExercise({ slug: 'overhead-press' }));

      await service.updateExercise('ex-1', { exerciseName: 'Overhead Press' });

      expect(repo.update).toHaveBeenCalledWith(
        'ex-1',
        expect.objectContaining({ slug: 'overhead-press' }),
      );
    });

    it('should not regenerate slug when name is not changed', async () => {
      repo.findById.mockResolvedValue(buildExercise());
      repo.update.mockResolvedValue(buildExercise({ difficulty: 'ADVANCED' }));

      await service.updateExercise('ex-1', { difficulty: 'ADVANCED' });

      expect(repo.update).toHaveBeenCalledWith(
        'ex-1',
        expect.not.objectContaining({ slug: expect.anything() }),
      );
      expect(repo.slugExists).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError for non-existent exercise', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(
        service.updateExercise('missing', { exerciseName: 'Nope' }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  // ── archiveExercise ──────────────────────────────────

  describe('archiveExercise', () => {
    it('should soft-archive and return the exercise', async () => {
      repo.findById.mockResolvedValue(buildExercise());
      repo.archive.mockResolvedValue(buildExercise({ isActive: false }));

      const result = await service.archiveExercise('ex-1');

      expect(result.isActive).toBe(false);
      expect(repo.archive).toHaveBeenCalledWith('ex-1');
    });

    it('should throw NotFoundError for non-existent exercise', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.archiveExercise('missing')).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should be idempotent — archiving already-archived exercise succeeds', async () => {
      repo.findById.mockResolvedValue(buildExercise({ isActive: false }));
      repo.archive.mockResolvedValue(buildExercise({ isActive: false }));

      const result = await service.archiveExercise('ex-1');

      expect(result.isActive).toBe(false);
    });
  });

  // ── unarchiveExercise ──────────────────────────────

  describe('unarchiveExercise', () => {
    it('should restore and return the exercise', async () => {
      repo.findById.mockResolvedValue(buildExercise({ isActive: false }));
      repo.unarchive.mockResolvedValue(buildExercise({ isActive: true }));

      const result = await service.unarchiveExercise('ex-1');

      expect(result.isActive).toBe(true);
      expect(repo.unarchive).toHaveBeenCalledWith('ex-1');
    });

    it('should throw NotFoundError for non-existent exercise', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.unarchiveExercise('missing')).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should be idempotent — unarchiving active exercise succeeds', async () => {
      repo.findById.mockResolvedValue(buildExercise({ isActive: true }));
      repo.unarchive.mockResolvedValue(buildExercise({ isActive: true }));

      const result = await service.unarchiveExercise('ex-1');

      expect(result.isActive).toBe(true);
    });
  });

  // ── listExercisesAdmin ─────────────────────────────

  describe('listExercisesAdmin', () => {
    it('should return paginated results including archived exercises', async () => {
      repo.findManyAdmin.mockResolvedValue({
        data: [
          buildExercise(),
          buildExercise({
            id: 'ex-2',
            isActive: false,
            exerciseName: 'Dead Lift',
            slug: 'dead-lift',
          }),
        ],
        totalCount: 2,
      });

      const result = await service.listExercisesAdmin({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(2);
      expect(result.meta.totalCount).toBe(2);
    });

    it('should pass isActive filter to repository', async () => {
      repo.findManyAdmin.mockResolvedValue({ data: [], totalCount: 0 });

      await service.listExercisesAdmin({ page: 1, limit: 20, isActive: false });

      expect(repo.findManyAdmin).toHaveBeenCalledWith(
        expect.objectContaining({ isActive: false }),
      );
    });

    it('should calculate totalPages correctly', async () => {
      repo.findManyAdmin.mockResolvedValue({ data: [], totalCount: 45 });

      const result = await service.listExercisesAdmin({ page: 1, limit: 20 });

      expect(result.meta.totalPages).toBe(3);
    });
  });
});
