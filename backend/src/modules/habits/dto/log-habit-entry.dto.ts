import { z } from 'zod';

/** Zod schema for logging a habit entry. */
export const LogHabitEntrySchema = z.object({
  entryDate: z.string().date('Must be a valid date (YYYY-MM-DD)'),
  isCompleted: z.boolean().default(true),
  recordedValue: z.number().min(0).optional(),
  notes: z.string().max(300).optional(),
});

export type LogHabitEntryDto = z.infer<typeof LogHabitEntrySchema>;
