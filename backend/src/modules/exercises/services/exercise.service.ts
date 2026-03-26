import { Inject, Injectable } from '@nestjs/common';
import { EXERCISE_REPOSITORY } from '../interfaces';
import { ExerciseMapper } from '../mappers/exercise.mapper';
import { NotFoundError } from '../../../common/errors';
import type { IExerciseRepository } from '../interfaces';
import type { CreateExerciseDto } from '../dto/create-exercise.dto';
import type { UpdateExerciseDto } from '../dto/update-exercise.dto';
import type { ExerciseFilterDto } from '../dto/exercise-filter.dto';
import type { AdminExerciseFilterDto } from '../dto/admin-exercise-filter.dto';
import type { ExerciseResponseDto } from '../dto/exercise-response.dto';
import type { PaginatedResult } from '../../../common/types/pagination';

/** Business logic for the exercise catalog. */
@Injectable()
export class ExerciseService {
  constructor(
    @Inject(EXERCISE_REPOSITORY)
    private readonly exerciseRepo: IExerciseRepository,
  ) {}

  /** List exercises with optional filters and pagination. */
  async listExercises(
    filter: ExerciseFilterDto,
  ): Promise<PaginatedResult<ExerciseResponseDto>> {
    const { data, totalCount } = await this.exerciseRepo.findMany(filter);

    return {
      data: data.map(ExerciseMapper.toResponse),
      meta: {
        page: filter.page,
        limit: filter.limit,
        totalCount,
        totalPages: Math.ceil(totalCount / filter.limit),
      },
    };
  }

  /** Get a single exercise by its URL-friendly slug. */
  async getExerciseBySlug(slug: string): Promise<ExerciseResponseDto> {
    const exercise = await this.exerciseRepo.findBySlug(slug);
    if (!exercise) throw new NotFoundError('Exercise', slug);
    return ExerciseMapper.toResponse(exercise);
  }

  /** Create a new exercise (admin/trainer only). Generates a unique slug from the name. */
  async createExercise(
    dto: CreateExerciseDto,
    createdBy: string,
  ): Promise<ExerciseResponseDto> {
    const slug = await this.generateUniqueSlug(dto.exerciseName);
    const exercise = await this.exerciseRepo.create(
      { ...dto, slug },
      createdBy,
    );
    return ExerciseMapper.toResponse(exercise);
  }

  /** Update an existing exercise (admin/trainer only). Re-slugs if name changes. */
  async updateExercise(
    id: string,
    dto: UpdateExerciseDto,
  ): Promise<ExerciseResponseDto> {
    await this.ensureExerciseExists(id);

    const updateData: UpdateExerciseDto & { slug?: string } = { ...dto };

    if (dto.exerciseName) {
      updateData.slug = await this.generateUniqueSlug(dto.exerciseName);
    }

    const updated = await this.exerciseRepo.update(id, updateData);
    return ExerciseMapper.toResponse(updated);
  }

  /** List exercises for admin — includes archived exercises based on filter. */
  async listExercisesAdmin(
    filter: AdminExerciseFilterDto,
  ): Promise<PaginatedResult<ExerciseResponseDto>> {
    const { data, totalCount } = await this.exerciseRepo.findManyAdmin(filter);

    return {
      data: data.map(ExerciseMapper.toResponse),
      meta: {
        page: filter.page,
        limit: filter.limit,
        totalCount,
        totalPages: Math.ceil(totalCount / filter.limit),
      },
    };
  }

  /** Soft-archive an exercise (admin/trainer only). Idempotent. */
  async archiveExercise(id: string): Promise<ExerciseResponseDto> {
    await this.ensureExerciseExists(id);
    const archived = await this.exerciseRepo.archive(id);
    return ExerciseMapper.toResponse(archived);
  }

  /** Restore an archived exercise (admin/trainer only). Idempotent. */
  async unarchiveExercise(id: string): Promise<ExerciseResponseDto> {
    await this.ensureExerciseExists(id);
    const restored = await this.exerciseRepo.unarchive(id);
    return ExerciseMapper.toResponse(restored);
  }

  // ── Private helpers ──────────────────────────────────────────

  private async ensureExerciseExists(id: string): Promise<void> {
    const existing = await this.exerciseRepo.findById(id);
    if (!existing) throw new NotFoundError('Exercise', id);
  }

  /** Generate a URL-friendly slug, appending a numeric suffix if it already exists. */
  private async generateUniqueSlug(exerciseName: string): Promise<string> {
    const baseSlug = this.toSlug(exerciseName);
    let candidate = baseSlug;
    let suffix = 1;

    while (await this.exerciseRepo.slugExists(candidate)) {
      suffix++;
      candidate = `${baseSlug}-${suffix}`;
    }

    return candidate;
  }

  /** Convert an exercise name to a lowercase, hyphenated slug. */
  private toSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
