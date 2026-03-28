import { z } from 'zod';

const BIOLOGICAL_SEX_VALUES = ['MALE', 'FEMALE', 'NOT_SPECIFIED'] as const;
const FITNESS_LEVEL_VALUES = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
const DIETARY_PREFERENCE_VALUES = [
  'NO_PREFERENCE',
  'VEGETARIAN',
  'VEGAN',
  'KETO',
  'PALEO',
  'HALAL',
] as const;

const MIN_HEIGHT_CM = 50;
const MAX_HEIGHT_CM = 300;

/** Zod schema for profile update input validation. */
export const UpdateProfileSchema = z.object({
  firstName: z.string().trim().min(1).max(50).optional(),
  lastName: z.string().trim().min(1).max(50).optional(),
  dateOfBirth: z.string().date('Must be a valid date (YYYY-MM-DD)').optional(),
  biologicalSex: z.enum(BIOLOGICAL_SEX_VALUES).optional(),
  heightCm: z.number().min(MIN_HEIGHT_CM).max(MAX_HEIGHT_CM).optional(),
  fitnessLevel: z.enum(FITNESS_LEVEL_VALUES).optional(),
  dietaryPreference: z.enum(DIETARY_PREFERENCE_VALUES).optional(),
  timezone: z.string().min(1).max(50).optional(),
  weightUnit: z.enum(['kg', 'lbs']).optional(),
  distanceUnit: z.enum(['km', 'mi']).optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  notifPrefs: z.object({
    email: z.boolean(),
    push: z.boolean(),
    workout_reminders: z.boolean(),
  }).optional(),
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
