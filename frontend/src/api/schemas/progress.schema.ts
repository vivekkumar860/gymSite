import { z } from "zod";

// ---------------------------------------------------------------------------
// Measurement
// ---------------------------------------------------------------------------

export const measurementSchema = z.object({
  id: z.string(),
  date: z.string(),
  weight: z.number().optional(),
  bodyFat: z.number().optional(),
  chest: z.number().optional(),
  waist: z.number().optional(),
  hips: z.number().optional(),
  biceps: z.number().optional(),
  thighs: z.number().optional(),
  notes: z.string().optional(),
});

export type Measurement = z.infer<typeof measurementSchema>;

// ---------------------------------------------------------------------------
// Exercise Progress
// ---------------------------------------------------------------------------

export const exerciseProgressSchema = z.object({
  exerciseId: z.string(),
  exerciseName: z.string(),
  history: z.array(
    z.object({
      date: z.string(),
      bestSet: z.object({
        reps: z.number(),
        weight: z.number(),
      }),
    }),
  ),
});

export type ExerciseProgress = z.infer<typeof exerciseProgressSchema>;

// ---------------------------------------------------------------------------
// Progress Photo
// ---------------------------------------------------------------------------

export const progressPhotoSchema = z.object({
  id: z.string(),
  date: z.string(),
  imageUrl: z.string(),
  notes: z.string().optional(),
});

export type ProgressPhoto = z.infer<typeof progressPhotoSchema>;
