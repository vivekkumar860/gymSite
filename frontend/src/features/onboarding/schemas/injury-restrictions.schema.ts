import { z } from "zod";

export const bodyAreas = [
  "shoulders",
  "back",
  "knees",
  "wrists",
  "ankles",
  "hips",
  "neck",
  "elbows",
] as const;

export const injuryRestrictionsSchema = z.object({
  hasInjuries: z.boolean(),
  injuredAreas: z.array(z.enum(bodyAreas)).optional(),
  injuryNotes: z
    .string()
    .max(500, "Notes must be under 500 characters")
    .optional(),
});

export type InjuryRestrictionsData = z.infer<typeof injuryRestrictionsSchema>;
