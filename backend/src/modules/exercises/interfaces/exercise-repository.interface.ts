import type { ExerciseDomain } from '../domain/exercise';
import type { ExerciseFilterDto } from '../dto/exercise-filter.dto';
import type { AdminExerciseFilterDto } from '../dto/admin-exercise-filter.dto';
import type { CreateExerciseDto } from '../dto/create-exercise.dto';
import type { UpdateExerciseDto } from '../dto/update-exercise.dto';

/** Paginated result from the repository layer. */
export interface ExercisePageResult {
  data: ExerciseDomain[];
  totalCount: number;
}

/**
 * Contract for exercise catalog data access.
 * Implementations handle Prisma queries and return domain types.
 */
export interface IExerciseRepository {
  /** Find an exercise by its UUID. */
  findById(id: string): Promise<ExerciseDomain | null>;

  /** Find an exercise by its URL-friendly slug. */
  findBySlug(slug: string): Promise<ExerciseDomain | null>;

  /** Find exercises matching filter criteria with pagination. Only active exercises. */
  findMany(filter: ExerciseFilterDto): Promise<ExercisePageResult>;

  /** Find exercises for admin view — includes archived exercises when isActive is omitted. */
  findManyAdmin(filter: AdminExerciseFilterDto): Promise<ExercisePageResult>;

  /** Check whether a slug already exists in the database. */
  slugExists(slug: string): Promise<boolean>;

  /** Persist a new exercise with a pre-generated slug. */
  create(
    data: CreateExerciseDto & { slug: string },
    createdBy: string,
  ): Promise<ExerciseDomain>;

  /** Update an exercise by ID. */
  update(
    id: string,
    data: UpdateExerciseDto & { slug?: string },
  ): Promise<ExerciseDomain>;

  /** Soft-archive an exercise by setting isActive to false. */
  archive(id: string): Promise<ExerciseDomain>;

  /** Restore an archived exercise by setting isActive to true. */
  unarchive(id: string): Promise<ExerciseDomain>;
}

/** DI token for IExerciseRepository. */
export const EXERCISE_REPOSITORY = Symbol('EXERCISE_REPOSITORY');
