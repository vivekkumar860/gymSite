import { z } from "zod";

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------

/** Matches backend CurrentUserResponseDto returned by GET /auth/me. */
export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  role: z.string(),
  accountStatus: z.string(),
  createdAt: z.string(),
});

export type User = z.infer<typeof userSchema>;

// ---------------------------------------------------------------------------
// User Preferences
// ---------------------------------------------------------------------------

export const userPreferencesSchema = z.object({
  weightUnit: z.enum(["kg", "lbs"]),
  distanceUnit: z.enum(["km", "mi"]),
  theme: z.enum(["light", "dark", "system"]),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    workout_reminders: z.boolean(),
  }),
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

// ---------------------------------------------------------------------------
// Onboarding Data
// ---------------------------------------------------------------------------

export const onboardingDataSchema = z.object({
  fitnessGoal: z.enum([
    "lose_weight",
    "build_muscle",
    "maintain",
    "improve_endurance",
  ]),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  preferredWorkoutDays: z.array(z.number()),
  height: z.number().optional(),
  weight: z.number().optional(),
  dateOfBirth: z.string().optional(),
  gender: z
    .enum(["male", "female", "other", "prefer_not_to_say"])
    .optional(),
  availableEquipment: z.array(z.string()).optional(),
  hasInjuries: z.boolean().optional(),
  injuredAreas: z.array(z.string()).optional(),
  injuryNotes: z.string().optional(),
  dietType: z.string().optional(),
  allergies: z.array(z.string()).optional(),
});

export type OnboardingData = z.infer<typeof onboardingDataSchema>;
