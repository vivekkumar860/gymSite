/** Domain representation of a user profile. */
export interface ProfileDomain {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: Date | null;
  biologicalSex: string;
  heightCm: number | null;
  fitnessLevel: string;
  dietaryPreference: string;
  timezone: string;
  avatarUrl: string | null;
  weightUnit: string;
  distanceUnit: string;
  theme: string;
  notifPrefs: Record<string, boolean> | null;
}
