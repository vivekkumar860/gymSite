import { z } from "zod";

const MUSCLE_GROUPS = [
  "CHEST", "BACK", "SHOULDERS", "BICEPS", "TRICEPS", "FOREARMS",
  "QUADRICEPS", "HAMSTRINGS", "GLUTES", "CALVES", "CORE", "FULL_BODY",
] as const;

const EQUIPMENT_TYPES = [
  "BARBELL", "DUMBBELL", "CABLE", "MACHINE", "BODYWEIGHT",
  "KETTLEBELL", "RESISTANCE_BAND", "OTHER",
] as const;

const DIFFICULTY_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

const MOVEMENT_PATTERNS = [
  "PUSH", "PULL", "HINGE", "SQUAT", "LUNGE", "CARRY", "ROTATION",
] as const;

export const exerciseFormSchema = z.object({
  exerciseName: z.string().trim().min(1, "Name is required").max(100),
  primaryMuscle: z.enum(MUSCLE_GROUPS, { error: "Primary muscle is required" }),
  secondaryMuscle: z.enum(MUSCLE_GROUPS).optional(),
  equipment: z.enum(EQUIPMENT_TYPES, { error: "Equipment is required" }),
  difficulty: z.enum(DIFFICULTY_LEVELS).default("BEGINNER"),
  movementPattern: z.enum(MOVEMENT_PATTERNS).optional(),
  instructions: z.string().max(5000).optional(),
  videoUrl: z.string().url("Must be a valid URL").max(500).optional(),
  isCompound: z.boolean().default(false),
});

export type ExerciseFormSchema = z.infer<typeof exerciseFormSchema>;

export { MUSCLE_GROUPS, EQUIPMENT_TYPES, DIFFICULTY_LEVELS, MOVEMENT_PATTERNS };
