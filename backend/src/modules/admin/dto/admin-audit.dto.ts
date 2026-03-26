import { z } from 'zod';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE_LIMIT,
} from '../../../common/types/pagination';

// ── Response ───────────────────────────────────────────────

/** Audit log entry response. */
export interface AuditLogResponseDto {
  id: string;
  adminUserId: string;
  adminUsername: string;
  actionType: string;
  targetTable: string;
  targetRecordId: string;
  changeSummary: unknown;
  ipAddress: string | null;
  createdAt: string;
}

// ── Request ────────────────────────────────────────────────

const ADMIN_ACTION_TYPE_VALUES = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'SUSPEND_USER',
  'RESTORE_USER',
] as const;

/** Audit log filters + pagination. */
export const AuditLogFilterSchema = z.object({
  actionType: z.enum(ADMIN_ACTION_TYPE_VALUES).optional(),
  targetTable: z.string().max(60).optional(),
  adminUserId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_LIMIT)
    .default(DEFAULT_PAGE_LIMIT),
});

export type AuditLogFilterDto = z.infer<typeof AuditLogFilterSchema>;

// ── Audit log creation input (internal) ────────────────────

export interface CreateAuditLogInput {
  adminUserId: string;
  actionType: string;
  targetTable: string;
  targetRecordId: string;
  changeSummary?: Record<string, unknown>;
  ipAddress?: string;
}
