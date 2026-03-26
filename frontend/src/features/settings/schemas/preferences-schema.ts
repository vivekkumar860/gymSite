import { z } from "zod";

export const preferencesSchema = z.object({
  weightUnit: z.enum(["kg", "lbs"]),
  distanceUnit: z.enum(["km", "mi"]),
  theme: z.enum(["light", "dark", "system"]),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    workout_reminders: z.boolean(),
  }),
});

export type PreferencesSchema = z.infer<typeof preferencesSchema>;
