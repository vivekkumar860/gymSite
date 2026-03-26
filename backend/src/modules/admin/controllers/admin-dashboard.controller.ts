import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminDashboardFacade } from '../facades/admin-dashboard.facade';
import { AdminAuditService } from '../services/admin-audit.service';
import { JwtAuthGuard, RolesGuard } from '../../../common/guards';
import { Roles } from '../../../common/decorators';
import { ZodValidationPipe } from '../../../common/pipes';
import { AuditLogFilterSchema } from '../dto/admin-audit.dto';
import type { AdminDashboardDto } from '../dto/admin-dashboard.dto';
import type {
  AuditLogFilterDto,
  AuditLogResponseDto,
} from '../dto/admin-audit.dto';
import type { PaginatedResult } from '../../../common/types/pagination';

/** Admin dashboard and audit log endpoints. */
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminDashboardController {
  constructor(
    private readonly dashboardFacade: AdminDashboardFacade,
    private readonly auditService: AdminAuditService,
  ) {}

  /** Get the admin dashboard summary. */
  @Get('dashboard')
  async getDashboard(): Promise<AdminDashboardDto> {
    return this.dashboardFacade.getDashboard();
  }

  /** Get paginated audit logs with filters. */
  @Get('audit-logs')
  async getAuditLogs(
    @Query(new ZodValidationPipe(AuditLogFilterSchema))
    filter: AuditLogFilterDto,
  ): Promise<PaginatedResult<AuditLogResponseDto>> {
    return this.auditService.listAuditLogs(filter);
  }
}
