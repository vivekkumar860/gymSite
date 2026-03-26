import { Test, TestingModule } from '@nestjs/testing';
import { AdminExerciseController } from '../controllers/admin-exercise.controller';
import { ExerciseService } from '../services/exercise.service';
import type { ExerciseResponseDto } from '../dto/exercise-response.dto';

describe('AdminExerciseController', () => {
  let controller: AdminExerciseController;
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
    isCompound: true,
    isActive: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminExerciseController],
      providers: [
        {
          provide: ExerciseService,
          useValue: {
            listExercisesAdmin: jest.fn(),
            createExercise: jest.fn(),
            updateExercise: jest.fn(),
            archiveExercise: jest.fn(),
            unarchiveExercise: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(AdminExerciseController);
    service = module.get(ExerciseService);
  });

  describe('list', () => {
    it('should delegate to service listExercisesAdmin', async () => {
      const paginated = {
        data: [mockResponse],
        meta: { page: 1, limit: 20, totalCount: 1, totalPages: 1 },
      };
      service.listExercisesAdmin.mockResolvedValue(paginated);

      const filter = { page: 1, limit: 20 };
      const result = await controller.list(filter as any);

      expect(result.data).toHaveLength(1);
      expect(service.listExercisesAdmin).toHaveBeenCalledWith(filter);
    });

    it('should pass isActive filter through', async () => {
      const paginated = {
        data: [],
        meta: { page: 1, limit: 20, totalCount: 0, totalPages: 0 },
      };
      service.listExercisesAdmin.mockResolvedValue(paginated);

      const filter = { page: 1, limit: 20, isActive: false };
      await controller.list(filter as any);

      expect(service.listExercisesAdmin).toHaveBeenCalledWith(filter);
    });
  });

  describe('create', () => {
    it('should delegate to service with dto and admin userId', async () => {
      service.createExercise.mockResolvedValue(mockResponse);

      const dto = {
        exerciseName: 'Bench Press',
        primaryMuscle: 'CHEST' as const,
        equipment: 'BARBELL' as const,
        difficulty: 'INTERMEDIATE' as const,
        isCompound: true,
      };

      const result = await controller.create(dto, 'admin-1');

      expect(result).toEqual(mockResponse);
      expect(service.createExercise).toHaveBeenCalledWith(dto, 'admin-1');
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
    it('should delegate to service archiveExercise', async () => {
      service.archiveExercise.mockResolvedValue({
        ...mockResponse,
        isActive: false,
      });

      const result = await controller.archive('ex-1');

      expect(result.isActive).toBe(false);
      expect(service.archiveExercise).toHaveBeenCalledWith('ex-1');
    });
  });

  describe('unarchive', () => {
    it('should delegate to service unarchiveExercise', async () => {
      service.unarchiveExercise.mockResolvedValue({
        ...mockResponse,
        isActive: true,
      });

      const result = await controller.unarchive('ex-1');

      expect(result.isActive).toBe(true);
      expect(service.unarchiveExercise).toHaveBeenCalledWith('ex-1');
    });
  });
});
