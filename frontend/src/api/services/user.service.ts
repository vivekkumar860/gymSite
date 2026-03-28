import { z } from "zod";
import { apiClient, ApiError } from "@/api/client";
import {
  onboardingDataSchema,
  type OnboardingData,
} from "@/api/schemas/user.schema";

// ---------------------------------------------------------------------------
// Schemas matching backend ProfileResponseDto
// ---------------------------------------------------------------------------

const profileResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  biologicalSex: z.string(),
  heightCm: z.number().nullable(),
  fitnessLevel: z.string(),
  dietaryPreference: z.string(),
  timezone: z.string(),
  avatarUrl: z.string().nullable(),
  weightUnit: z.string().optional(),
  distanceUnit: z.string().optional(),
  theme: z.string().optional(),
  notifPrefs: z.object({
    email: z.boolean(),
    push: z.boolean(),
    workout_reminders: z.boolean(),
  }).nullable().optional(),
});

export type ProfileResponse = z.infer<typeof profileResponseSchema>;

// Preferences don't have a dedicated backend endpoint yet
export type UserPreferences = {
  weightUnit: "kg" | "lbs";
  distanceUnit: "km" | "mi";
  theme: "light" | "dark" | "system";
  notifications: {
    email: boolean;
    push: boolean;
    workout_reminders: boolean;
  };
};

const defaultPreferences: UserPreferences = {
  weightUnit: "kg",
  distanceUnit: "km",
  theme: "system",
  notifications: {
    email: true,
    push: true,
    workout_reminders: true,
  },
};

// ---------------------------------------------------------------------------
// User Service
// ---------------------------------------------------------------------------

export async function getProfile(): Promise<ProfileResponse> {
  return apiClient.get("/profiles/me", profileResponseSchema);
}

export async function updateProfile(
  data: Partial<{ firstName: string; lastName: string; avatarUrl: string }>,
): Promise<ProfileResponse> {
  return apiClient.patch("/profiles/me", data, profileResponseSchema);
}

export async function getPreferences(): Promise<UserPreferences> {
  const profile = await getProfile();
  return {
    weightUnit: (profile.weightUnit as UserPreferences["weightUnit"]) ?? "kg",
    distanceUnit: (profile.distanceUnit as UserPreferences["distanceUnit"]) ?? "km",
    theme: (profile.theme as UserPreferences["theme"]) ?? "system",
    notifications: (profile.notifPrefs as UserPreferences["notifications"]) ?? defaultPreferences.notifications,
  };
}

export async function updatePreferences(
  data: Partial<UserPreferences>,
): Promise<UserPreferences> {
  const payload: Record<string, unknown> = {};
  if (data.weightUnit) payload.weightUnit = data.weightUnit;
  if (data.distanceUnit) payload.distanceUnit = data.distanceUnit;
  if (data.theme) payload.theme = data.theme;
  if (data.notifications) payload.notifPrefs = data.notifications;
  await apiClient.patch("/profiles/me", payload, z.any());
  return getPreferences();
}

export async function completeOnboarding(
  data: OnboardingData,
): Promise<void> {
  const profileUpdate: Record<string, unknown> = {};
  if (data.dateOfBirth) profileUpdate.dateOfBirth = data.dateOfBirth;
  if (data.height) profileUpdate.heightCm = data.height;
  if (data.gender) {
    const genderMap: Record<string, string> = {
      male: "MALE",
      female: "FEMALE",
      other: "NOT_SPECIFIED",
      prefer_not_to_say: "NOT_SPECIFIED",
    };
    profileUpdate.biologicalSex = genderMap[data.gender] ?? "NOT_SPECIFIED";
  }
  if (data.experienceLevel) {
    profileUpdate.fitnessLevel = data.experienceLevel.toUpperCase();
  }

  if (Object.keys(profileUpdate).length > 0) {
    await apiClient.patch("/profiles/me", profileUpdate, z.any());
  }

  const steps = [
    "PROFILE_CREATED",
    "GOAL_SELECTED",
    "FITNESS_LEVEL_SET",
  ] as const;

  for (const step of steps) {
    await apiClient.post("/onboarding/complete-step", { step }, z.any());
  }
}
