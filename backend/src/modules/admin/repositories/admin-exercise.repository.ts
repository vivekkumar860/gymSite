import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import type {
  AdminExerciseDto,
  AdminExerciseFilterDto,
  AdminCreateExerciseDto,
  AdminUpdateExerciseDto,
} from '../dto/admin-exercise.dto';

/** Data access for admin exercise management. */
@Injectable()
export class AdminExerciseRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Paginated exercise list — includes inactive exercises. */
  async findMany(
    filter: AdminExerciseFilterDto,
  ): Promise<{ data: AdminExerciseDto[]; totalCount: number }> {
    const where = this.buildWhere(filter);
    const skip = (filter.page - 1) * filter.limit;

    const [records, totalCount] = await this.prisma.$transaction([
      this.prisma.exercise.findMany({
        where,
        skip,
        take: filter.limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.exercise.count({ where }),
    ]);

    return {
      data: records.map((r) => this.toDto(r)),
      totalCount,
    };
  }

  /** Find a single exercise by ID (including inactive). */
  async findById(id: string): Promise<AdminExerciseDto | null> {
    const record = await this.prisma.exercise.findUnique({ where: { id } });
    return record ? this.toDto(record) : null;
  }

  /** Create a new exercise. */
  async create(
    data: AdminCreateExerciseDto & { slug: string },
    createdBy: string,
  ): Promise<AdminExerciseDto> {
    const record = await this.prisma.exercise.create({
      data: { ...data, createdBy },
    });
    return this.toDto(record);
  }

  /** Update an exercise. */
  async update(
    id: string,
    data: AdminUpdateExerciseDto & { slug?: string },
  ): Promise<AdminExerciseDto> {
    const record = await this.prisma.exercise.update({
      where: { id },
      data,
    });
    return this.toDto(record);
  }

  /** Check whether a slug already exists. */
  async slugExists(slug: string): Promise<boolean> {
    const count = await this.prisma.exercise.count({ where: { slug } });
    return count > 0;
  }

  private toDto(record: any): AdminExerciseDto {
    return {
      id: record.id,
      exerciseName: record.exerciseName,
      slug: record.slug,
      primaryMuscle: record.primaryMuscle,
      secondaryMuscle: record.secondaryMuscle,
      equipment: record.equipment,
      difficulty: record.difficulty,
      movementPattern: record.movementPattern,
      instructions: record.instructions,
      videoUrl: record.videoUrl,
      isCompound: record.isCompound,
      isActive: record.isActive,
      createdBy: record.createdBy,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  private buildWhere(
    filter: AdminExerciseFilterDto,
  ): Prisma.ExerciseWhereInput {
    const where: Prisma.ExerciseWhereInput = {};
    if (filter.primaryMuscle) where.primaryMuscle = filter.primaryMuscle;
    if (filter.equipment) where.equipment = filter.equipment;
    if (filter.difficulty) where.difficulty = filter.difficulty;
    if (filter.movementPattern) where.movementPattern = filter.movementPattern;
    if (filter.isCompound !== undefined) where.isCompound = filter.isCompound;
    if (filter.isActive !== undefined) where.isActive = filter.isActive;
    if (filter.search) {
      where.exerciseName = { contains: filter.search, mode: 'insensitive' };
    }
    return where;
  }
}
