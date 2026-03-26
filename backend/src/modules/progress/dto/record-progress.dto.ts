import { z } from 'zod';

const METRIC_TYPE_VALUES = [
  'BODY_WEIGHT',
  'BODY_FAT_PCT',
  'RESTING_HEART_RATE',
] as const;

/** Zod schema for recording a progress entry. */
export const RecordProgressSchema = z.object({
  metricType: z.enum(METRIC_TYPE_VALUES),
  recordedValue: z.number().min(0).max(999),
  recordedAt: z.string().date('Must be a valid date (YYYY-MM-DD)'),
  notes: z.string().max(300).optional(),
});

export type RecordProgressDto = z.infer<typeof RecordProgressSchema>;
