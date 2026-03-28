import { z } from "zod";

const GOAL_VALUES = [
  "LOSE_WEIGHT",
  "GAIN_MUSCLE",
  "INCREASE_STRENGTH",
  "IMPROVE_ENDURANCE",
  "MAINTAIN",
] as const;

const EXPERIENCE_VALUES = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

const EQUIPMENT_VALUES = [
  "BARBELL",
  "DUMBBELL",
  "CABLE",
  "MACHINE",
  "BODYWEIGHT",
  "KETTLEBELL",
  "RESISTANCE_BAND",
  "OTHER",
] as const;

export const generatePlanSchema = z.object({
  goal: z.enum(GOAL_VALUES, { message: "Select a goal" }),
  experienceLevel: z.enum(EXPERIENCE_VALUES, {
    message: "Select your experience level",
  }),
  daysPerWeek: z.number().int().min(1).max(7),
  durationWeeks: z.number().int().min(1).max(52),
  sessionDurationMinutes: z.number().int().min(20).max(120),
  availableEquipment: z
    .array(z.enum(EQUIPMENT_VALUES))
    .min(1, "Select at least one equipment type"),
  injuryRestrictions: z.array(z.string().trim().max(100)),
});

export type GeneratePlanFormValues = z.infer<typeof generatePlanSchema>;

export { GOAL_VALUES, EXPERIENCE_VALUES, EQUIPMENT_VALUES };
