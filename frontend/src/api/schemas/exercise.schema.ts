import { z } from "zod";

// ---------------------------------------------------------------------------
// Exercise (matches backend ExerciseResponseDto)
// ---------------------------------------------------------------------------

export const exerciseSchema = z.object({
  id: z.string(),
  exerciseName: z.string(),
  slug: z.string(),
  primaryMuscle: z.string(),
  secondaryMuscle: z.string().nullable(),
  equipment: z.string(),
  difficulty: z.string(),
  movementPattern: z.string().nullable(),
  instructions: z.string().nullable(),
  videoUrl: z.string().nullable(),
  imageUrl: z.string().nullable(),
  isCompound: z.boolean(),
  isActive: z.boolean(),
});

export type Exercise = z.infer<typeof exerciseSchema>;

// ---------------------------------------------------------------------------
// Exercise Summary (same shape, used in lists)
// ---------------------------------------------------------------------------

export const exerciseSummarySchema = exerciseSchema;

export type ExerciseSummary = Exercise;
