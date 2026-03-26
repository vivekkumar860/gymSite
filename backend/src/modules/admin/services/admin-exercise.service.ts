import { Injectable } from '@nestjs/common';
import { AdminExerciseRepository } from '../repositories/admin-exercise.repository';
import { AdminAuditService } from './admin-audit.service';
import { NotFoundError } from '../../../common/errors';
import type {
  AdminExerciseFilterDto,
  AdminCreateExerciseDto,
  AdminUpdateExerciseDto,
  AdminExerciseDto,
} from '../dto/admin-exercise.dto';
import type { PaginatedResult } from '../../../common/types/pagination';

/** Business logic for admin exercise management. */
@Injectable()
export class AdminExerciseService {
  constructor(
    private readonly exerciseRepo: AdminExerciseRepository,
    private readonly auditService: AdminAuditService,
  ) {}

  /** List exercises with admin-level filters (includes inactive). */
  async listExercises(
    filter: AdminExerciseFilterDto,
  ): Promise<PaginatedResult<AdminExerciseDto>> {
    const { data, totalCount } = await this.exerciseRepo.findMany(filter);

    return {
      data,
      meta: {
        page: filter.page,
        limit: filter.limit,
        totalCount,
        totalPages: Math.ceil(totalCount / filter.limit),
      },
    };
  }

  /** Get a single exercise by ID. */
  async getExercise(id: string): Promise<AdminExerciseDto> {
    const exercise = await this.exerciseRepo.findById(id);
    if (!exercise) throw new NotFoundError('Exercise', id);
    return exercise;
  }

  /** Create a new exercise with audit trail. */
  async createExercise(
    adminUserId: string,
    dto: AdminCreateExerciseDto,
  ): Promise<AdminExerciseDto> {
    const slug = await this.generateUniqueSlug(dto.exerciseName);
    const exercise = await this.exerciseRepo.create(
      { ...dto, slug },
      adminUserId,
    );

    await this.auditService.log({
      adminUserId,
      actionType: 'CREATE',
      targetTable: 'exercises',
      targetRecordId: exercise.id,
      changeSummary: { after: { exerciseName: dto.exerciseName, slug } },
    });

    return exercise;
  }

  /** Update an exercise with audit trail. */
  async updateExercise(
    adminUserId: string,
    exerciseId: string,
    dto: AdminUpdateExerciseDto,
  ): Promise<AdminExerciseDto> {
    const existing = await this.exerciseRepo.findById(exerciseId);
    if (!existing) throw new NotFoundError('Exercise', exerciseId);

    const updateData: AdminUpdateExerciseDto & { slug?: string } = { ...dto };
    if (dto.exerciseName) {
      updateData.slug = await this.generateUniqueSlug(dto.exerciseName);
    }

    const updated = await this.exerciseRepo.update(exerciseId, updateData);

    // Build a diff of changed fields
    const before: Record<string, unknown> = {};
    const after: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined && (existing as any)[key] !== value) {
        before[key] = (existing as any)[key];
        after[key] = value;
      }
    }

    await this.auditService.log({
      adminUserId,
      actionType: 'UPDATE',
      targetTable: 'exercises',
      targetRecordId: exerciseId,
      changeSummary: { before, after },
    });

    return updated;
  }

  /** Soft-delete (deactivate) an exercise with audit trail. */
  async deactivateExercise(
    adminUserId: string,
    exerciseId: string,
  ): Promise<AdminExerciseDto> {
    const existing = await this.exerciseRepo.findById(exerciseId);
    if (!existing) throw new NotFoundError('Exercise', exerciseId);

    const updated = await this.exerciseRepo.update(exerciseId, {
      isActive: false,
    });

    await this.auditService.log({
      adminUserId,
      actionType: 'DELETE',
      targetTable: 'exercises',
      targetRecordId: exerciseId,
      changeSummary: { before: { isActive: true }, after: { isActive: false } },
    });

    return updated;
  }

  // ── Private helpers ──────────────────────────────────────

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
