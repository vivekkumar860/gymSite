import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseRepository } from '../repositories/exercise.repository';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

describe('ExerciseRepository', () => {
  let repository: ExerciseRepository;
  let prisma: {
    exercise: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  const mockPrismaExercise = {
    id: 'ex-1',
    exerciseName: 'Bench Press',
    slug: 'bench-press',
    primaryMuscle: 'CHEST',
    secondaryMuscle: 'TRICEPS',
    equipment: 'BARBELL',
    difficulty: 'INTERMEDIATE',
    movementPattern: 'PUSH',
    instructions: 'Press the bar.',
    videoUrl: null,
    imageUrl: null,
    isCompound: true,
    isActive: true,
    createdBy: 'user-1',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  beforeEach(async () => {
    prisma = {
      exercise: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExerciseRepository,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    repository = module.get(ExerciseRepository);
  });

  describe('findById', () => {
    it('should return domain object when found', async () => {
      prisma.exercise.findUnique.mockResolvedValue(mockPrismaExercise);

      const result = await repository.findById('ex-1');

      expect(result).not.toBeNull();
      expect(result!.id).toBe('ex-1');
      expect(result!.slug).toBe('bench-press');
      expect(result!.movementPattern).toBe('PUSH');
    });

    it('should return null when not found', async () => {
      prisma.exercise.findUnique.mockResolvedValue(null);

      const result = await repository.findById('missing');

      expect(result).toBeNull();
    });
  });

  describe('findBySlug', () => {
    it('should look up by slug and return domain object', async () => {
      prisma.exercise.findUnique.mockResolvedValue(mockPrismaExercise);

      const result = await repository.findBySlug('bench-press');

      expect(result).not.toBeNull();
      expect(result!.exerciseName).toBe('Bench Press');
      expect(prisma.exercise.findUnique).toHaveBeenCalledWith({
        where: { slug: 'bench-press' },
      });
    });

    it('should return null for non-existent slug', async () => {
      prisma.exercise.findUnique.mockResolvedValue(null);

      const result = await repository.findBySlug('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should return paginated results', async () => {
      prisma.$transaction.mockResolvedValue([[mockPrismaExercise], 1]);

      const result = await repository.findMany({
        page: 1,
        limit: 20,
        primaryMuscle: 'CHEST',
      } as any);

      expect(result.data).toHaveLength(1);
      expect(result.totalCount).toBe(1);
    });

    it('should apply movementPattern filter', async () => {
      prisma.$transaction.mockResolvedValue([[], 0]);

      await repository.findMany({
        page: 1,
        limit: 20,
        movementPattern: 'PUSH',
      } as any);

      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe('slugExists', () => {
    it('should return true when slug exists', async () => {
      prisma.exercise.count.mockResolvedValue(1);

      const result = await repository.slugExists('bench-press');

      expect(result).toBe(true);
    });

    it('should return false when slug does not exist', async () => {
      prisma.exercise.count.mockResolvedValue(0);

      const result = await repository.slugExists('nonexistent');

      expect(result).toBe(false);
    });
  });

  describe('create', () => {
    it('should create and return domain object with slug', async () => {
      prisma.exercise.create.mockResolvedValue(mockPrismaExercise);

      const result = await repository.create(
        {
          exerciseName: 'Bench Press',
          slug: 'bench-press',
          primaryMuscle: 'CHEST',
          equipment: 'BARBELL',
          difficulty: 'INTERMEDIATE',
          isCompound: true,
        },
        'user-1',
      );

      expect(result.exerciseName).toBe('Bench Press');
      expect(prisma.exercise.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          slug: 'bench-press',
          createdBy: 'user-1',
        }),
      });
    });
  });

  describe('archive', () => {
    it('should set isActive to false', async () => {
      prisma.exercise.update.mockResolvedValue({
        ...mockPrismaExercise,
        isActive: false,
      });

      const result = await repository.archive('ex-1');

      expect(result.isActive).toBe(false);
      expect(prisma.exercise.update).toHaveBeenCalledWith({
        where: { id: 'ex-1' },
        data: { isActive: false },
      });
    });
  });
});
