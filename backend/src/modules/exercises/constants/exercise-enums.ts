/**
 * Canonical enum value arrays for exercise classification.
 * Imported by DTOs and filters — single source of truth.
 * Values must match the Prisma schema enums exactly.
 */

/** Primary and secondary muscle group targets. */
export const MUSCLE_GROUP_VALUES = [
  'CHEST',
  'BACK',
  'SHOULDERS',
  'BICEPS',
  'TRICEPS',
  'FOREARMS',
  'QUADRICEPS',
  'HAMSTRINGS',
  'GLUTES',
  'CALVES',
  'CORE',
  'FULL_BODY',
] as const;

/** Equipment required to perform the exercise. */
export const EQUIPMENT_VALUES = [
  'BARBELL',
  'DUMBBELL',
  'CABLE',
  'MACHINE',
  'BODYWEIGHT',
  'KETTLEBELL',
  'RESISTANCE_BAND',
  'OTHER',
] as const;

/** Exercise difficulty levels. */
export const DIFFICULTY_VALUES = [
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
] as const;

/** Biomechanical movement pattern classification. */
export const MOVEMENT_PATTERN_VALUES = [
  'PUSH',
  'PULL',
  'HINGE',
  'SQUAT',
  'LUNGE',
  'CARRY',
  'ROTATION',
] as const;
