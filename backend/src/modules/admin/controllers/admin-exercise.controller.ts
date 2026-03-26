import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminExerciseService } from '../services/admin-exercise.service';
import { JwtAuthGuard, RolesGuard } from '../../../common/guards';
import { CurrentUser, Roles } from '../../../common/decorators';
import { ZodValidationPipe } from '../../../common/pipes';
import {
  AdminExerciseFilterSchema,
  AdminCreateExerciseSchema,
  AdminUpdateExerciseSchema,
} from '../dto/admin-exercise.dto';
import type {
  AdminExerciseFilterDto,
  AdminCreateExerciseDto,
  AdminUpdateExerciseDto,
  AdminExerciseDto,
} from '../dto/admin-exercise.dto';
import type { PaginatedResult } from '../../../common/types/pagination';

/** Admin exercise CRUD endpoints. */
@Controller('admin/exercises')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminExerciseController {
  constructor(private readonly adminExerciseService: AdminExerciseService) {}

  /** List exercises with admin filters (includes inactive). */
  @Get()
  async list(
    @Query(new ZodValidationPipe(AdminExerciseFilterSchema))
    filter: AdminExerciseFilterDto,
  ): Promise<PaginatedResult<AdminExerciseDto>> {
    return this.adminExerciseService.listExercises(filter);
  }

  /** Get a single exercise by ID. */
  @Get(':id')
  async detail(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AdminExerciseDto> {
    return this.adminExerciseService.getExercise(id);
  }

  /** Create a new exercise. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(AdminCreateExerciseSchema))
    dto: AdminCreateExerciseDto,
    @CurrentUser() adminUserId: string,
  ): Promise<AdminExerciseDto> {
    return this.adminExerciseService.createExercise(adminUserId, dto);
  }

  /** Update an exercise. */
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(AdminUpdateExerciseSchema))
    dto: AdminUpdateExerciseDto,
    @CurrentUser() adminUserId: string,
  ): Promise<AdminExerciseDto> {
    return this.adminExerciseService.updateExercise(adminUserId, id, dto);
  }

  /** Soft-delete (deactivate) an exercise. */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() adminUserId: string,
  ): Promise<void> {
    await this.adminExerciseService.deactivateExercise(adminUserId, id);
  }
}
