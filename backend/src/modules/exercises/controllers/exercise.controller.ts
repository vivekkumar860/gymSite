import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ExerciseService } from '../services/exercise.service';
import { ZodValidationPipe } from '../../../common/pipes';
import { JwtAuthGuard, RolesGuard } from '../../../common/guards';
import { CurrentUser, Roles } from '../../../common/decorators';
import { CreateExerciseSchema } from '../dto/create-exercise.dto';
import { UpdateExerciseSchema } from '../dto/update-exercise.dto';
import { ExerciseFilterSchema } from '../dto/exercise-filter.dto';
import type { CreateExerciseDto } from '../dto/create-exercise.dto';
import type { UpdateExerciseDto } from '../dto/update-exercise.dto';
import type { ExerciseFilterDto } from '../dto/exercise-filter.dto';
import type { ExerciseResponseDto } from '../dto/exercise-response.dto';
import type { PaginatedResult } from '../../../common/types/pagination';

/** Handles exercise catalog endpoints. Public read, admin-only write. */
@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  /** List exercises with optional filters. Public endpoint. */
  @Get()
  async list(
    @Query(new ZodValidationPipe(ExerciseFilterSchema))
    filter: ExerciseFilterDto,
  ): Promise<PaginatedResult<ExerciseResponseDto>> {
    return this.exerciseService.listExercises(filter);
  }

  /** Get a single exercise by its URL-friendly slug. Public endpoint. */
  @Get(':slug')
  async getBySlug(@Param('slug') slug: string): Promise<ExerciseResponseDto> {
    return this.exerciseService.getExerciseBySlug(slug);
  }

  /** Create a new exercise. Admin and trainer only. */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TRAINER')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(CreateExerciseSchema)) dto: CreateExerciseDto,
    @CurrentUser() userId: string,
  ): Promise<ExerciseResponseDto> {
    return this.exerciseService.createExercise(dto, userId);
  }

  /** Update an existing exercise. Admin and trainer only. */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TRAINER')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateExerciseSchema)) dto: UpdateExerciseDto,
  ): Promise<ExerciseResponseDto> {
    return this.exerciseService.updateExercise(id, dto);
  }

  /** Soft-archive an exercise. Admin and trainer only. Idempotent. */
  @Patch(':id/archive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TRAINER')
  async archive(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ExerciseResponseDto> {
    return this.exerciseService.archiveExercise(id);
  }
}
