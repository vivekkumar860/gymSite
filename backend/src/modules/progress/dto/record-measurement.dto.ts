import { z } from 'zod';

const MEASUREMENT_SITE_VALUES = [
  'NECK',
  'CHEST',
  'LEFT_BICEP',
  'RIGHT_BICEP',
  'WAIST',
  'HIPS',
  'LEFT_THIGH',
  'RIGHT_THIGH',
  'LEFT_CALF',
  'RIGHT_CALF',
] as const;

/** Zod schema for recording a body measurement. */
export const RecordMeasurementSchema = z.object({
  site: z.enum(MEASUREMENT_SITE_VALUES),
  valueCm: z.number().min(1).max(500),
  measuredAt: z.string().date('Must be a valid date (YYYY-MM-DD)'),
  notes: z.string().max(300).optional(),
});

export type RecordMeasurementDto = z.infer<typeof RecordMeasurementSchema>;
