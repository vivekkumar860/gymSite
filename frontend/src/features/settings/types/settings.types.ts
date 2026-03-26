export type { UserPreferences } from "@/api/schemas/user.schema";

export type UpdateProfileFormValues = {
  name: string;
  email: string;
};

export type UpdatePreferencesFormValues = {
  weightUnit: "kg" | "lbs";
  distanceUnit: "km" | "mi";
  theme: "light" | "dark" | "system";
  notifications: {
    email: boolean;
    push: boolean;
    workout_reminders: boolean;
  };
};
