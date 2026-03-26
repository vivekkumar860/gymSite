import { apiClient, type QueryParams } from "@/api/client";
import { paginatedResponseSchema } from "@/api/schemas/common.schema";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Admin Dashboard
// ---------------------------------------------------------------------------

const adminDashboardSchema = z.object({
  totalUsers: z.number(),
  activeUsers: z.number(),
  suspendedUsers: z.number(),
  totalExercises: z.number(),
  totalWorkoutSessions: z.number(),
  totalGoals: z.number(),
  newUsersToday: z.number(),
  newUsersThisWeek: z.number(),
});

export type AdminDashboard = z.infer<typeof adminDashboardSchema>;

export async function getDashboard(): Promise<AdminDashboard> {
  return apiClient.get("/admin/dashboard", adminDashboardSchema);
}

// ---------------------------------------------------------------------------
// Admin Users
// ---------------------------------------------------------------------------

const adminUserListItemSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  role: z.string(),
  accountStatus: z.string(),
  createdAt: z.string(),
});

export type AdminUserListItem = z.infer<typeof adminUserListItemSchema>;

const adminUserDetailSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  role: z.string(),
  accountStatus: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  profile: z
    .object({
      firstName: z.string().nullable(),
      lastName: z.string().nullable(),
      fitnessLevel: z.string(),
      dietaryPreference: z.string(),
      avatarUrl: z.string().nullable(),
    })
    .nullable(),
  stats: z.object({
    totalWorkoutSessions: z.number(),
    totalGoals: z.number(),
    totalHabits: z.number(),
  }),
});

export type AdminUserDetail = z.infer<typeof adminUserDetailSchema>;

const userListResponseSchema = paginatedResponseSchema(adminUserListItemSchema);

export async function getUsers(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    accountStatus?: string;
  } = {},
) {
  return apiClient.get("/admin/users", userListResponseSchema, params as QueryParams);
}

export async function getUserById(id: string): Promise<AdminUserDetail> {
  return apiClient.get(`/admin/users/${id}`, adminUserDetailSchema);
}

export async function suspendUser(id: string): Promise<void> {
  await apiClient.post(`/admin/users/${id}/suspend`, {}, z.any());
}

export async function restoreUser(id: string): Promise<void> {
  await apiClient.post(`/admin/users/${id}/restore`, {}, z.any());
}

export async function updateUserRole(
  id: string,
  role: string,
): Promise<void> {
  await apiClient.patch(`/admin/users/${id}/role`, { role }, z.any());
}

// ---------------------------------------------------------------------------
// Admin Exercises
// ---------------------------------------------------------------------------

const adminExerciseSchema = z.object({
  id: z.string(),
  exerciseName: z.string(),
  slug: z.string(),
  primaryMuscle: z.string(),
  secondaryMuscle: z.string().nullable(),
  equipment: z.string(),
  difficulty: z.string(),
  movementPattern: z.string().nullable(),
  instructions: z.string().nullable(),
  videoUrl: z.string().nullable(),
  isCompound: z.boolean(),
  isActive: z.boolean(),
});

export type AdminExercise = z.infer<typeof adminExerciseSchema>;

const exerciseListResponseSchema = paginatedResponseSchema(adminExerciseSchema);

export async function getExercises(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    primaryMuscle?: string;
    equipment?: string;
    difficulty?: string;
    isActive?: boolean;
  } = {},
) {
  return apiClient.get("/admin/exercises", exerciseListResponseSchema, params as QueryParams);
}

export async function getExerciseById(id: string): Promise<AdminExercise> {
  return apiClient.get(`/admin/exercises/${id}`, adminExerciseSchema);
}

export type CreateExerciseInput = {
  exerciseName: string;
  primaryMuscle: string;
  secondaryMuscle?: string;
  equipment: string;
  difficulty?: string;
  movementPattern?: string;
  instructions?: string;
  videoUrl?: string;
  isCompound?: boolean;
};

export async function createExercise(
  data: CreateExerciseInput,
): Promise<AdminExercise> {
  return apiClient.post("/admin/exercises", data, adminExerciseSchema);
}

export async function updateExercise(
  id: string,
  data: Partial<CreateExerciseInput> & { isActive?: boolean },
): Promise<AdminExercise> {
  return apiClient.patch(`/admin/exercises/${id}`, data, adminExerciseSchema);
}

export async function archiveExercise(id: string): Promise<AdminExercise> {
  return apiClient.patch(`/admin/exercises/${id}/archive`, {}, adminExerciseSchema);
}

export async function unarchiveExercise(id: string): Promise<AdminExercise> {
  return apiClient.patch(`/admin/exercises/${id}/unarchive`, {}, adminExerciseSchema);
}

// ---------------------------------------------------------------------------
// Audit Logs
// ---------------------------------------------------------------------------

const auditLogSchema = z.object({
  id: z.string(),
  adminUserId: z.string(),
  adminUsername: z.string(),
  actionType: z.string(),
  targetTable: z.string(),
  targetRecordId: z.string(),
  changeSummary: z.unknown(),
  ipAddress: z.string().nullable(),
  createdAt: z.string(),
});

export type AuditLog = z.infer<typeof auditLogSchema>;

const auditLogListResponseSchema = paginatedResponseSchema(auditLogSchema);

export async function getAuditLogs(
  params: {
    page?: number;
    limit?: number;
    actionType?: string;
    targetTable?: string;
    adminUserId?: string;
  } = {},
) {
  return apiClient.get("/admin/audit-logs", auditLogListResponseSchema, params as QueryParams);
}
