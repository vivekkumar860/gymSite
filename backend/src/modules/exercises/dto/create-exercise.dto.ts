import { z } from 'zod';
import {
  MUSCLE_GROUP_VALUES,
  EQUIPMENT_VALUES,
  DIFFICULTY_VALUES,
  MOVEMENT_PATTERN_VALUES,
} from '../constants/exercise-enums';

const EXERCISE_NAME_MAX = 100;
const INSTRUCTIONS_MAX = 5000;
const VIDEO_URL_MAX = 500;

/** Zod schema for creating a new exercise. */
export const CreateExerciseSchema = z.object({
  exerciseName: z.string().trim().min(1).max(EXERCISE_NAME_MAX),
  primaryMuscle: z.enum(MUSCLE_GROUP_VALUES),
  secondaryMuscle: z.enum(MUSCLE_GROUP_VALUES).optional(),
  equipment: z.enum(EQUIPMENT_VALUES),
  difficulty: z.enum(DIFFICULTY_VALUES).default('BEGINNER'),
  movementPattern: z.enum(MOVEMENT_PATTERN_VALUES).optional(),
  instructions: z.string().max(INSTRUCTIONS_MAX).optional(),
  videoUrl: z.string().url().max(VIDEO_URL_MAX).optional(),
  isCompound: z.boolean().default(false),
});

/** Validated input for exercise creation. */
export type CreateExerciseDto = z.infer<typeof CreateExerciseSchema>;
