import { z } from "zod";

export const createHabitSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  frequency: z.enum(["DAILY", "WEEKLY"]),
  targetCount: z.coerce.number().int().min(1).max(100),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export type CreateHabitSchema = z.infer<typeof createHabitSchema>;
