import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import type {
  AuditLogResponseDto,
  AuditLogFilterDto,
  CreateAuditLogInput,
} from '../dto/admin-audit.dto';

/** Data access for admin audit logs. */
@Injectable()
export class AdminAuditRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Write an immutable audit log entry. */
  async create(data: CreateAuditLogInput): Promise<void> {
    await this.prisma.adminAuditLog.create({
      data: {
        adminUserId: data.adminUserId,
        actionType: data.actionType as any,
        targetTable: data.targetTable,
        targetRecordId: data.targetRecordId,
        changeSummary: data.changeSummary as any,
        ipAddress: data.ipAddress,
      },
    });
  }

  /** Find audit logs with filters and pagination. */
  async findMany(
    filter: AuditLogFilterDto,
  ): Promise<{ data: AuditLogResponseDto[]; totalCount: number }> {
    const where = this.buildWhere(filter);
    const skip = (filter.page - 1) * filter.limit;

    const [records, totalCount] = await this.prisma.$transaction([
      this.prisma.adminAuditLog.findMany({
        where,
        skip,
        take: filter.limit,
        orderBy: { createdAt: 'desc' },
        include: { admin: { select: { username: true } } },
      }),
      this.prisma.adminAuditLog.count({ where }),
    ]);

    return {
      data: records.map((r) => ({
        id: r.id,
        adminUserId: r.adminUserId,
        adminUsername: r.admin.username,
        actionType: r.actionType,
        targetTable: r.targetTable,
        targetRecordId: r.targetRecordId,
        changeSummary: r.changeSummary,
        ipAddress: r.ipAddress,
        createdAt: r.createdAt.toISOString(),
      })),
      totalCount,
    };
  }

  private buildWhere(
    filter: AuditLogFilterDto,
  ): Prisma.AdminAuditLogWhereInput {
    const where: Prisma.AdminAuditLogWhereInput = {};
    if (filter.actionType) where.actionType = filter.actionType;
    if (filter.targetTable) where.targetTable = filter.targetTable;
    if (filter.adminUserId) where.adminUserId = filter.adminUserId;
    return where;
  }
}
