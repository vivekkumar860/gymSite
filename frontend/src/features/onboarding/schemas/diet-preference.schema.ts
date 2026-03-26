import { z } from "zod";

export const dietTypes = [
  "no_preference",
  "vegetarian",
  "vegan",
  "keto",
  "paleo",
  "mediterranean",
  "high_protein",
] as const;

export const dietPreferenceSchema = z.object({
  dietType: z.enum(dietTypes, {
    message: "Please select a diet preference",
  }),
  allergies: z.array(z.string()).optional(),
});

export type DietPreferenceData = z.infer<typeof dietPreferenceSchema>;
