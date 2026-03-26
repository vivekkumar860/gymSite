import { z } from 'zod';
import { CreateHabitSchema } from './create-habit.dto';

/** Zod schema for updating a habit. */
export const UpdateHabitSchema = CreateHabitSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type UpdateHabitDto = z.infer<typeof UpdateHabitSchema>;
