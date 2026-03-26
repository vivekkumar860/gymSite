import { z } from 'zod';

/** Zod schema for rescheduling a missed workout day. */
export const RescheduleDaySchema = z.object({
  newDate: z.coerce
    .date()
    .refine(
      (d) => d >= new Date(new Date().toDateString()),
      'Rescheduled date must be today or in the future',
    ),
});

/** Validated input for rescheduling a workout day. */
export type RescheduleDayDto = z.infer<typeof RescheduleDaySchema>;
