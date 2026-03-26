import { z } from "zod";

// ---------------------------------------------------------------------------
// Exercise Set
// ---------------------------------------------------------------------------

/** Matches backend WorkoutSetLogResponseDto. */
export const exerciseSetSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  setNumber: z.number(),
  weightKg: z.number().nullable(),
  repsCompleted: z.number(),
  rpe: z.number().nullable(),
  isWarmup: z.boolean(),
  isFailure: z.boolean(),
});

export type ExerciseSet = z.infer<typeof exerciseSetSchema>;

// ---------------------------------------------------------------------------
// Workout Exercise
// ---------------------------------------------------------------------------

export const workoutExerciseSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  exerciseName: z.string(),
  sets: z.array(exerciseSetSchema),
  order: z.number(),
  notes: z.string().optional(),
});

export type WorkoutExercise = z.infer<typeof workoutExerciseSchema>;

// ---------------------------------------------------------------------------
// Workout
// ---------------------------------------------------------------------------

export const workoutSchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.string(),
  status: z.enum(["planned", "in_progress", "completed", "skipped"]),
  exercises: z.array(workoutExerciseSchema),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  duration: z.number().optional(),
  notes: z.string().optional(),
});

export type Workout = z.infer<typeof workoutSchema>;

// ---------------------------------------------------------------------------
// Workout Summary (list view)
// ---------------------------------------------------------------------------

export const workoutSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.string(),
  status: z.enum(["planned", "in_progress", "completed", "skipped"]),
  exerciseCount: z.number(),
  totalSets: z.number(),
  totalVolume: z.number(),
  duration: z.number().optional(),
});

export type WorkoutSummary = z.infer<typeof workoutSummarySchema>;
