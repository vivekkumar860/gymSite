import { z } from 'zod';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE_LIMIT,
} from '../../../common/types/pagination';
import {
  MUSCLE_GROUP_VALUES,
  EQUIPMENT_VALUES,
  DIFFICULTY_VALUES,
  MOVEMENT_PATTERN_VALUES,
} from '../../exercises/constants/exercise-enums';

// ── Response DTOs ──────────────────────────────────────────

/** Admin view of an exercise — includes inactive flag and creator info. */
export interface AdminExerciseDto {
  id: string;
  exerciseName: string;
  slug: string;
  primaryMuscle: string;
  secondaryMuscle: string | null;
  equipment: string;
  difficulty: string;
  movementPattern: string | null;
  instructions: string | null;
  videoUrl: string | null;
  isCompound: boolean;
  isActive: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Request DTOs ───────────────────────────────────────────

/** Admin exercise list filters — includes inactive exercises. */
export const AdminExerciseFilterSchema = z.object({
  primaryMuscle: z.enum(MUSCLE_GROUP_VALUES).optional(),
  equipment: z.enum(EQUIPMENT_VALUES).optional(),
  difficulty: z.enum(DIFFICULTY_VALUES).optional(),
  movementPattern: z.enum(MOVEMENT_PATTERN_VALUES).optional(),
  isCompound: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().optional(),
  search: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_LIMIT)
    .default(DEFAULT_PAGE_LIMIT),
});

export type AdminExerciseFilterDto = z.infer<typeof AdminExerciseFilterSchema>;

/** Zod schema for admin creating an exercise. */
export const AdminCreateExerciseSchema = z.object({
  exerciseName: z.string().trim().min(1).max(100),
  primaryMuscle: z.enum(MUSCLE_GROUP_VALUES),
  secondaryMuscle: z.enum(MUSCLE_GROUP_VALUES).optional(),
  equipment: z.enum(EQUIPMENT_VALUES),
  difficulty: z.enum(DIFFICULTY_VALUES).default('BEGINNER'),
  movementPattern: z.enum(MOVEMENT_PATTERN_VALUES).optional(),
  instructions: z.string().max(5000).optional(),
  videoUrl: z.string().url().max(500).optional(),
  isCompound: z.boolean().default(false),
});

export type AdminCreateExerciseDto = z.infer<typeof AdminCreateExerciseSchema>;

/** Zod schema for admin updating an exercise. */
export const AdminUpdateExerciseSchema =
  AdminCreateExerciseSchema.partial().extend({
    isActive: z.boolean().optional(),
  });

export type AdminUpdateExerciseDto = z.infer<typeof AdminUpdateExerciseSchema>;
