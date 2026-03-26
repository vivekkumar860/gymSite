import { Injectable } from '@nestjs/common';
import { AdminUserRepository } from '../repositories/admin-user.repository';
import { AdminAuditService } from './admin-audit.service';
import { NotFoundError, AuthorizationError } from '../../../common/errors';
import type {
  AdminUserFilterDto,
  AdminUserListDto,
  AdminUserDetailDto,
  UpdateUserRoleDto,
} from '../dto/admin-user.dto';
import type { PaginatedResult } from '../../../common/types/pagination';

/** Business logic for admin user management. */
@Injectable()
export class AdminUserService {
  constructor(
    private readonly userRepo: AdminUserRepository,
    private readonly auditService: AdminAuditService,
  ) {}

  /** List users with filters and pagination. */
  async listUsers(
    filter: AdminUserFilterDto,
  ): Promise<PaginatedResult<AdminUserListDto>> {
    const { data, totalCount } = await this.userRepo.findMany(filter);

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

  /** Get user detail with profile and activity stats. */
  async getUserDetail(userId: string): Promise<AdminUserDetailDto> {
    const detail = await this.userRepo.findDetailById(userId);
    if (!detail) throw new NotFoundError('User', userId);
    return detail;
  }

  /** Suspend a user account. */
  async suspendUser(adminUserId: string, targetUserId: string): Promise<void> {
    this.ensureNotSelf(adminUserId, targetUserId, 'suspend');
    const user = await this.ensureUserExists(targetUserId);

    await this.userRepo.updateStatus(targetUserId, 'SUSPENDED');
    await this.auditService.log({
      adminUserId,
      actionType: 'SUSPEND_USER',
      targetTable: 'users',
      targetRecordId: targetUserId,
      changeSummary: {
        before: { accountStatus: user.accountStatus },
        after: { accountStatus: 'SUSPENDED' },
      },
    });
  }

  /** Restore a suspended user account. */
  async restoreUser(adminUserId: string, targetUserId: string): Promise<void> {
    const user = await this.ensureUserExists(targetUserId);

    await this.userRepo.updateStatus(targetUserId, 'ACTIVE');
    await this.auditService.log({
      adminUserId,
      actionType: 'RESTORE_USER',
      targetTable: 'users',
      targetRecordId: targetUserId,
      changeSummary: {
        before: { accountStatus: user.accountStatus },
        after: { accountStatus: 'ACTIVE' },
      },
    });
  }

  /** Change a user's role. */
  async updateUserRole(
    adminUserId: string,
    targetUserId: string,
    dto: UpdateUserRoleDto,
  ): Promise<void> {
    this.ensureNotSelf(adminUserId, targetUserId, 'change role of');
    const user = await this.ensureUserExists(targetUserId);

    await this.userRepo.updateRole(targetUserId, dto.role);
    await this.auditService.log({
      adminUserId,
      actionType: 'UPDATE',
      targetTable: 'users',
      targetRecordId: targetUserId,
      changeSummary: { before: { role: user.role }, after: { role: dto.role } },
    });
  }

  // ── Private helpers ──────────────────────────────────────

  private async ensureUserExists(
    userId: string,
  ): Promise<{ role: string; accountStatus: string }> {
    const user = await this.userRepo.findBasicById(userId);
    if (!user) throw new NotFoundError('User', userId);
    return user;
  }

  private ensureNotSelf(
    adminUserId: string,
    targetUserId: string,
    action: string,
  ): void {
    if (adminUserId === targetUserId) {
      throw new AuthorizationError(`You cannot ${action} your own account`);
    }
  }
}
