import { z } from "zod";

export const logSetSchema = z.object({
  reps: z.coerce.number().int().min(1).max(999),
  weight: z.coerce.number().min(0).max(9999),
  weightUnit: z.enum(["kg", "lbs"]),
  isWarmup: z.boolean().default(false),
  isDropSet: z.boolean().default(false),
  rpe: z.coerce.number().min(0).max(10).optional(),
});

export type LogSetSchema = z.infer<typeof logSetSchema>;
