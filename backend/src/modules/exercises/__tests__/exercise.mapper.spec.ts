import { ExerciseMapper } from '../mappers/exercise.mapper';
import type { Exercise } from '@prisma/client';
import type { ExerciseDomain } from '../domain/exercise';

describe('ExerciseMapper', () => {
  const prismaRecord = {
    id: 'ex-1',
    exerciseName: 'Deadlift',
    slug: 'deadlift',
    primaryMuscle: 'BACK',
    secondaryMuscle: 'HAMSTRINGS',
    equipment: 'BARBELL',
    difficulty: 'ADVANCED',
    movementPattern: 'HINGE',
    instructions: 'Lift the bar from the floor.',
    videoUrl: 'https://example.com/deadlift.mp4',
    imageUrl: null,
    isCompound: true,
    isActive: true,
    createdBy: 'user-1',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
  } as Exercise;

  describe('toDomain', () => {
    it('should map all Prisma fields to domain object', () => {
      const domain = ExerciseMapper.toDomain(prismaRecord);

      expect(domain.id).toBe('ex-1');
      expect(domain.exerciseName).toBe('Deadlift');
      expect(domain.slug).toBe('deadlift');
      expect(domain.primaryMuscle).toBe('BACK');
      expect(domain.secondaryMuscle).toBe('HAMSTRINGS');
      expect(domain.equipment).toBe('BARBELL');
      expect(domain.difficulty).toBe('ADVANCED');
      expect(domain.movementPattern).toBe('HINGE');
      expect(domain.isCompound).toBe(true);
      expect(domain.createdBy).toBe('user-1');
      expect(domain.createdAt).toEqual(new Date('2025-01-15'));
    });

    it('should handle null optional fields', () => {
      const withNulls = {
        ...prismaRecord,
        secondaryMuscle: null,
        movementPattern: null,
        videoUrl: null,
        instructions: null,
        createdBy: null,
      } as Exercise;

      const domain = ExerciseMapper.toDomain(withNulls);

      expect(domain.secondaryMuscle).toBeNull();
      expect(domain.movementPattern).toBeNull();
      expect(domain.videoUrl).toBeNull();
      expect(domain.createdBy).toBeNull();
    });
  });

  describe('toResponse', () => {
    it('should map domain to response DTO without internal fields', () => {
      const domain: ExerciseDomain = {
        id: 'ex-1',
        exerciseName: 'Deadlift',
        slug: 'deadlift',
        primaryMuscle: 'BACK',
        secondaryMuscle: 'HAMSTRINGS',
        equipment: 'BARBELL',
        difficulty: 'ADVANCED',
        movementPattern: 'HINGE',
        instructions: 'Lift the bar.',
        videoUrl: null,
        imageUrl: null,
        isCompound: true,
        isActive: true,
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const response = ExerciseMapper.toResponse(domain);

      expect(response.id).toBe('ex-1');
      expect(response.slug).toBe('deadlift');
      expect(response.movementPattern).toBe('HINGE');
      expect(response).not.toHaveProperty('createdBy');
      expect(response).not.toHaveProperty('createdAt');
      expect(response).not.toHaveProperty('updatedAt');
    });
  });
});
