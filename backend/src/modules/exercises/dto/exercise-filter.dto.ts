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
} from '../constants/exercise-enums';

const SEARCH_MAX = 100;

/** Zod schema for filtering and paginating exercises. */
export const ExerciseFilterSchema = z.object({
  primaryMuscle: z.enum(MUSCLE_GROUP_VALUES).optional(),
  equipment: z.enum(EQUIPMENT_VALUES).optional(),
  difficulty: z.enum(DIFFICULTY_VALUES).optional(),
  movementPattern: z.enum(MOVEMENT_PATTERN_VALUES).optional(),
  isCompound: z.coerce.boolean().optional(),
  search: z.string().trim().max(SEARCH_MAX).optional(),
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_LIMIT)
    .default(DEFAULT_PAGE_LIMIT),
});

/** Validated filter + pagination input. */
export type ExerciseFilterDto = z.infer<typeof ExerciseFilterSchema>;
