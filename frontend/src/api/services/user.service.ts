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
  return defaultPreferences;
}

export async function updatePreferences(
  _data: Partial<UserPreferences>,
): Promise<UserPreferences> {
  throw new ApiError(
    501,
    "Preferences saving is not yet implemented. Your changes were not saved.",
  );
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
