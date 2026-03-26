import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminUserService } from '../services/admin-user.service';
import { JwtAuthGuard, RolesGuard } from '../../../common/guards';
import { CurrentUser, Roles } from '../../../common/decorators';
import { ZodValidationPipe } from '../../../common/pipes';
import {
  AdminUserFilterSchema,
  UpdateUserRoleSchema,
} from '../dto/admin-user.dto';
import type {
  AdminUserFilterDto,
  UpdateUserRoleDto,
  AdminUserListDto,
  AdminUserDetailDto,
} from '../dto/admin-user.dto';
import type { PaginatedResult } from '../../../common/types/pagination';

/** Admin user management endpoints. */
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  /** List all users with filters and pagination. */
  @Get()
  async list(
    @Query(new ZodValidationPipe(AdminUserFilterSchema))
    filter: AdminUserFilterDto,
  ): Promise<PaginatedResult<AdminUserListDto>> {
    return this.adminUserService.listUsers(filter);
  }

  /** Get a single user's detail with profile and stats. */
  @Get(':userId')
  async detail(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<AdminUserDetailDto> {
    return this.adminUserService.getUserDetail(userId);
  }

  /** Suspend a user account. */
  @Post(':userId/suspend')
  @HttpCode(HttpStatus.NO_CONTENT)
  async suspend(
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() adminUserId: string,
  ): Promise<void> {
    await this.adminUserService.suspendUser(adminUserId, userId);
  }

  /** Restore a suspended user account. */
  @Post(':userId/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restore(
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() adminUserId: string,
  ): Promise<void> {
    await this.adminUserService.restoreUser(adminUserId, userId);
  }

  /** Change a user's role. */
  @Patch(':userId/role')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateRole(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body(new ZodValidationPipe(UpdateUserRoleSchema)) dto: UpdateUserRoleDto,
    @CurrentUser() adminUserId: string,
  ): Promise<void> {
    await this.adminUserService.updateUserRole(adminUserId, userId, dto);
  }
}
