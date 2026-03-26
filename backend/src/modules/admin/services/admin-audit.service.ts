import { Injectable } from '@nestjs/common';
import { AdminAuditRepository } from '../repositories/admin-audit.repository';
import type {
  AuditLogFilterDto,
  AuditLogResponseDto,
  CreateAuditLogInput,
} from '../dto/admin-audit.dto';
import type { PaginatedResult } from '../../../common/types/pagination';

/** Centralized audit logging and query service. */
@Injectable()
export class AdminAuditService {
  constructor(private readonly auditRepo: AdminAuditRepository) {}

  /** Write an audit log entry. Called by other admin services after mutations. */
  async log(input: CreateAuditLogInput): Promise<void> {
    await this.auditRepo.create(input);
  }

  /** Get paginated audit logs with optional filters. */
  async listAuditLogs(
    filter: AuditLogFilterDto,
  ): Promise<PaginatedResult<AuditLogResponseDto>> {
    const { data, totalCount } = await this.auditRepo.findMany(filter);

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
}
