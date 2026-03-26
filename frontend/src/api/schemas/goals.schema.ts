import { z } from "zod";

// ---------------------------------------------------------------------------
// Goal
// ---------------------------------------------------------------------------

export const goalSchema = z.object({
  id: z.string(),
  type: z.enum([
    "weight",
    "strength",
    "habit",
    "body_measurement",
    "custom",
  ]),
  title: z.string(),
  description: z.string().optional(),
  targetValue: z.number(),
  currentValue: z.number(),
  unit: z.string().optional(),
  startDate: z.string(),
  targetDate: z.string(),
  status: z.enum(["active", "completed", "abandoned"]),
  createdAt: z.string(),
});

export type Goal = z.infer<typeof goalSchema>;
