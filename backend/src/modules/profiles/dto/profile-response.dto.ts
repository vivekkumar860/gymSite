/** Shape of the profile response returned to the client. */
export interface ProfileResponseDto {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  biologicalSex: string;
  heightCm: number | null;
  fitnessLevel: string;
  dietaryPreference: string;
  timezone: string;
  avatarUrl: string | null;
}
