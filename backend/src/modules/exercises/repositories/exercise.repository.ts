import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { ExerciseMapper } from '../mappers/exercise.mapper';
import type { IExerciseRepository, ExercisePageResult } from '../interfaces';
import type { ExerciseDomain } from '../domain/exercise';
import type { ExerciseFilterDto } from '../dto/exercise-filter.dto';
import type { AdminExerciseFilterDto } from '../dto/admin-exercise-filter.dto';
import type { CreateExerciseDto } from '../dto/create-exercise.dto';
import type { UpdateExerciseDto } from '../dto/update-exercise.dto';

/** Prisma-backed implementation of the exercise repository contract. */
@Injectable()
export class ExerciseRepository implements IExerciseRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Find an exercise by its UUID. */
  async findById(id: string): Promise<ExerciseDomain | null> {
    const record = await this.prisma.exercise.findUnique({ where: { id } });
    if (!record) return null;
    return ExerciseMapper.toDomain(record);
  }

  /** Find an exercise by its URL-friendly slug. */
  async findBySlug(slug: string): Promise<ExerciseDomain | null> {
    const record = await this.prisma.exercise.findUnique({ where: { slug } });
    if (!record) return null;
    return ExerciseMapper.toDomain(record);
  }

  /** Find exercises matching filter criteria with pagination. */
  async findMany(filter: ExerciseFilterDto): Promise<ExercisePageResult> {
    const where = this.buildWhereClause(filter);
    const skip = (filter.page - 1) * filter.limit;

    const [records, totalCount] = await this.prisma.$transaction([
      this.prisma.exercise.findMany({
        where,
        skip,
        take: filter.limit,
        orderBy: { exerciseName: 'asc' },
      }),
      this.prisma.exercise.count({ where }),
    ]);

    return {
      data: records.map(ExerciseMapper.toDomain),
      totalCount,
    };
  }

  /** Check whether a slug already exists. */
  async slugExists(slug: string): Promise<boolean> {
    const count = await this.prisma.exercise.count({ where: { slug } });
    return count > 0;
  }

  /** Persist a new exercise. */
  async create(
    data: CreateExerciseDto & { slug: string },
    createdBy: string,
  ): Promise<ExerciseDomain> {
    const record = await this.prisma.exercise.create({
      data: { ...data, createdBy },
    });
    return ExerciseMapper.toDomain(record);
  }

  /** Update an exercise by ID. */
  async update(
    id: string,
    data: UpdateExerciseDto & { slug?: string },
  ): Promise<ExerciseDomain> {
    const record = await this.prisma.exercise.update({
      where: { id },
      data,
    });
    return ExerciseMapper.toDomain(record);
  }

  /** Find exercises for admin view — includes archived when isActive is omitted. */
  async findManyAdmin(
    filter: AdminExerciseFilterDto,
  ): Promise<ExercisePageResult> {
    const where = this.buildAdminWhereClause(filter);
    const skip = (filter.page - 1) * filter.limit;

    const [records, totalCount] = await this.prisma.$transaction([
      this.prisma.exercise.findMany({
        where,
        skip,
        take: filter.limit,
        orderBy: { exerciseName: 'asc' },
      }),
      this.prisma.exercise.count({ where }),
    ]);

    return {
      data: records.map(ExerciseMapper.toDomain),
      totalCount,
    };
  }

  /** Soft-archive an exercise. */
  async archive(id: string): Promise<ExerciseDomain> {
    const record = await this.prisma.exercise.update({
      where: { id },
      data: { isActive: false },
    });
    return ExerciseMapper.toDomain(record);
  }

  /** Restore an archived exercise. */
  async unarchive(id: string): Promise<ExerciseDomain> {
    const record = await this.prisma.exercise.update({
      where: { id },
      data: { isActive: true },
    });
    return ExerciseMapper.toDomain(record);
  }

  private buildWhereClause(
    filter: ExerciseFilterDto,
  ): Prisma.ExerciseWhereInput {
    return this.buildBaseWhereClause(filter, { isActive: true });
  }

  private buildAdminWhereClause(
    filter: AdminExerciseFilterDto,
  ): Prisma.ExerciseWhereInput {
    const defaults: Prisma.ExerciseWhereInput = {};
    if (filter.isActive !== undefined) defaults.isActive = filter.isActive;
    return this.buildBaseWhereClause(filter, defaults);
  }

  private buildBaseWhereClause(
    filter: Pick<
      ExerciseFilterDto,
      | 'primaryMuscle'
      | 'equipment'
      | 'difficulty'
      | 'movementPattern'
      | 'isCompound'
      | 'search'
    >,
    initial: Prisma.ExerciseWhereInput,
  ): Prisma.ExerciseWhereInput {
    const where: Prisma.ExerciseWhereInput = { ...initial };

    if (filter.primaryMuscle) where.primaryMuscle = filter.primaryMuscle;
    if (filter.equipment) where.equipment = filter.equipment;
    if (filter.difficulty) where.difficulty = filter.difficulty;
    if (filter.movementPattern) where.movementPattern = filter.movementPattern;
    if (filter.isCompound !== undefined) where.isCompound = filter.isCompound;
    if (filter.search) {
      where.exerciseName = { contains: filter.search, mode: 'insensitive' };
    }

    return where;
  }
}
