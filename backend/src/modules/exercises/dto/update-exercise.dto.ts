import { z } from 'zod';
import { CreateExerciseSchema } from './create-exercise.dto';

/** Zod schema for updating an exercise — all fields optional. */
export const UpdateExerciseSchema = CreateExerciseSchema.partial();

/** Validated input for exercise update. */
export type UpdateExerciseDto = z.infer<typeof UpdateExerciseSchema>;
