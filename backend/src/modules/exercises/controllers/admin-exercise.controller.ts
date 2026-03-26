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
import { AdminExerciseFilterSchema } from '../dto/admin-exercise-filter.dto';
import type { CreateExerciseDto } from '../dto/create-exercise.dto';
import type { UpdateExerciseDto } from '../dto/update-exercise.dto';
import type { AdminExerciseFilterDto } from '../dto/admin-exercise-filter.dto';
import type { ExerciseResponseDto } from '../dto/exercise-response.dto';
import type { PaginatedResult } from '../../../common/types/pagination';

/** Admin-only exercise management endpoints. All routes require ADMIN role. */
@Controller('admin/exercises')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  /** List all exercises including archived ones. Supports search and filters. */
  @Get()
  async list(
    @Query(new ZodValidationPipe(AdminExerciseFilterSchema))
    filter: AdminExerciseFilterDto,
  ): Promise<PaginatedResult<ExerciseResponseDto>> {
    return this.exerciseService.listExercisesAdmin(filter);
  }

  /** Create a new exercise. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(CreateExerciseSchema)) dto: CreateExerciseDto,
    @CurrentUser() adminUserId: string,
  ): Promise<ExerciseResponseDto> {
    return this.exerciseService.createExercise(dto, adminUserId);
  }

  /** Update an existing exercise. */
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateExerciseSchema)) dto: UpdateExerciseDto,
  ): Promise<ExerciseResponseDto> {
    return this.exerciseService.updateExercise(id, dto);
  }

  /** Soft-archive an exercise. Idempotent. */
  @Patch(':id/archive')
  async archive(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ExerciseResponseDto> {
    return this.exerciseService.archiveExercise(id);
  }

  /** Restore an archived exercise. Idempotent. */
  @Patch(':id/unarchive')
  async unarchive(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ExerciseResponseDto> {
    return this.exerciseService.unarchiveExercise(id);
  }
}
