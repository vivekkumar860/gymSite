import { z } from 'zod';

const FREQUENCY_VALUES = ['DAILY', 'WEEKLY', 'CUSTOM'] as const;
const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;

/** Zod schema for creating a habit. */
export const CreateHabitSchema = z.object({
  habitName: z.string().trim().min(1).max(80),
  frequency: z.enum(FREQUENCY_VALUES).default('DAILY'),
  targetValue: z.number().min(0).optional(),
  unitLabel: z.string().trim().max(30).optional(),
  colorHex: z
    .string()
    .regex(HEX_COLOR_REGEX, 'Must be a valid hex color')
    .optional(),
});

export type CreateHabitDto = z.infer<typeof CreateHabitSchema>;
