import { z } from 'zod';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE_LIMIT,
} from '../../../common/types/pagination';

/** Zod schema for filtering workout session history. */
export const WorkoutHistoryFilterSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_LIMIT)
    .default(DEFAULT_PAGE_LIMIT),
});

/** Validated filter for workout session history. */
export type WorkoutHistoryFilterDto = z.infer<
  typeof WorkoutHistoryFilterSchema
>;
