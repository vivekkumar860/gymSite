import { z } from "zod";

export const createGoalSchema = z.object({
  type: z.enum(["LOSE_WEIGHT", "GAIN_MUSCLE", "INCREASE_STRENGTH", "IMPROVE_ENDURANCE", "MAINTAIN", "CUSTOM"]),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(500).optional(),
  targetValue: z.number().positive("Target value must be positive"),
  unit: z.string().optional(),
  targetDate: z.string().min(1, "Target date is required"),
});

export type CreateGoalSchema = z.infer<typeof createGoalSchema>;
