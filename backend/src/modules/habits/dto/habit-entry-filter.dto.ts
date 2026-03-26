import { z } from 'zod';

/** Zod schema for filtering habit entries by date range. */
export const HabitEntryFilterSchema = z.object({
  from: z.string().date('Must be a valid date (YYYY-MM-DD)'),
  to: z.string().date('Must be a valid date (YYYY-MM-DD)'),
});

export type HabitEntryFilterDto = z.infer<typeof HabitEntryFilterSchema>;
