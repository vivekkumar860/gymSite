import { z } from "zod";

export const experienceLevels = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

export const activityScheduleSchema = z.object({
  experienceLevel: z.enum(experienceLevels, {
    message: "Please select your experience level",
  }),
  preferredWorkoutDays: z
    .array(z.number().min(0).max(6))
    .min(1, "Select at least one day"),
});

export type ActivityScheduleData = z.infer<typeof activityScheduleSchema>;
