import { z } from 'zod';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE_LIMIT,
} from '../../../common/types/pagination';

// ── Response DTOs ──────────────────────────────────────────

/** Admin view of a user in list context. */
export interface AdminUserListDto {
  id: string;
  username: string;
  email: string;
  role: string;
  accountStatus: string;
  createdAt: string;
}

/** Admin view of a single user with profile details. */
export interface AdminUserDetailDto {
  id: string;
  username: string;
  email: string;
  role: string;
  accountStatus: string;
  createdAt: string;
  updatedAt: string;
  profile: {
    firstName: string | null;
    lastName: string | null;
    fitnessLevel: string;
    dietaryPreference: string;
    avatarUrl: string | null;
  } | null;
  stats: {
    totalWorkoutSessions: number;
    totalGoals: number;
    totalHabits: number;
  };
}

// ── Request DTOs ───────────────────────────────────────────

const ACCOUNT_STATUS_VALUES = ['ACTIVE', 'SUSPENDED', 'DEACTIVATED'] as const;
const USER_ROLE_VALUES = ['MEMBER', 'TRAINER', 'ADMIN'] as const;

/** Zod schema for user list filters + pagination. */
export const AdminUserFilterSchema = z.object({
  search: z.string().trim().max(100).optional(),
  role: z.enum(USER_ROLE_VALUES).optional(),
  accountStatus: z.enum(ACCOUNT_STATUS_VALUES).optional(),
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_LIMIT)
    .default(DEFAULT_PAGE_LIMIT),
});

export type AdminUserFilterDto = z.infer<typeof AdminUserFilterSchema>;

/** Zod schema for changing a user's role. */
export const UpdateUserRoleSchema = z.object({
  role: z.enum(USER_ROLE_VALUES),
});

export type UpdateUserRoleDto = z.infer<typeof UpdateUserRoleSchema>;
