import { z } from 'zod';

const PHOTO_POSE_VALUES = [
  'FRONT_RELAXED',
  'BACK_RELAXED',
  'SIDE_LEFT',
  'SIDE_RIGHT',
  'FRONT_FLEXING',
  'BACK_FLEXING',
] as const;

/** Zod schema for uploading a progress photo (metadata only). */
export const UploadPhotoSchema = z.object({
  pose: z.enum(PHOTO_POSE_VALUES),
  takenAt: z.string().date('Must be a valid date (YYYY-MM-DD)'),
  notes: z.string().max(300).optional(),
});

export type UploadPhotoDto = z.infer<typeof UploadPhotoSchema>;
