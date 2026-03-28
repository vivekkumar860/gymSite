import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseController } from '../controllers/exercise.controller';
import { ExerciseService } from '../services/exercise.service';
import { EXERCISE_REPOSITORY } from '../interfaces';
import type { ExerciseResponseDto } from '../dto/exercise-response.dto';

describe('ExerciseController', () => {
  let controller: ExerciseController;
  let service: jest.Mocked<ExerciseService>;

  const mockResponse: ExerciseResponseDto = {
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
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExerciseController],
      providers: [
        {
          provide: ExerciseService,
          useValue: {
            listExercises: jest.fn(),
            getExerciseBySlug: jest.fn(),
            createExercise: jest.fn(),
            updateExercise: jest.fn(),
            archiveExercise: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(ExerciseController);
    service = module.get(ExerciseService);
  });

  describe('list', () => {
    it('should delegate to service with parsed filter', async () => {
      const paginated = {
        data: [mockResponse],
        meta: { page: 1, limit: 20, totalCount: 1, totalPages: 1 },
      };
      service.listExercises.mockResolvedValue(paginated);

      const filter = { page: 1, limit: 20 };
      const result = await controller.list(filter as any);

      expect(result.data).toHaveLength(1);
      expect(service.listExercises).toHaveBeenCalledWith(filter);
    });
  });

  describe('getBySlug', () => {
    it('should delegate to service with slug parameter', async () => {
      service.getExerciseBySlug.mockResolvedValue(mockResponse);

      const result = await controller.getBySlug('bench-press');

      expect(result).toEqual(mockResponse);
      expect(service.getExerciseBySlug).toHaveBeenCalledWith('bench-press');
    });
  });

  describe('create', () => {
    it('should delegate to service with dto and userId', async () => {
      service.createExercise.mockResolvedValue(mockResponse);

      const dto = {
        exerciseName: 'Bench Press',
        primaryMuscle: 'CHEST' as const,
        equipment: 'BARBELL' as const,
        difficulty: 'INTERMEDIATE' as const,
        isCompound: true,
      };

      const result = await controller.create(dto, 'user-1');

      expect(result).toEqual(mockResponse);
      expect(service.createExercise).toHaveBeenCalledWith(dto, 'user-1');
    });
  });

  describe('update', () => {
    it('should delegate to service with id and dto', async () => {
      service.updateExercise.mockResolvedValue(mockResponse);

      const dto = { exerciseName: 'Updated Name' };
      const result = await controller.update('ex-1', dto);

      expect(result).toEqual(mockResponse);
      expect(service.updateExercise).toHaveBeenCalledWith('ex-1', dto);
    });
  });

  describe('archive', () => {
    it('should delegate to service with id', async () => {
      service.archiveExercise.mockResolvedValue({
        ...mockResponse,
        isActive: false,
      });

      const result = await controller.archive('ex-1');

      expect(result.isActive).toBe(false);
      expect(service.archiveExercise).toHaveBeenCalledWith('ex-1');
    });
  });
});
