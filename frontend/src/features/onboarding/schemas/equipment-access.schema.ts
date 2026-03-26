import { z } from "zod";

export const equipmentOptions = [
  "full_gym",
  "dumbbells",
  "barbell",
  "resistance_bands",
  "pull_up_bar",
  "kettlebell",
  "bodyweight_only",
  "cardio_machines",
] as const;

export const equipmentAccessSchema = z.object({
  availableEquipment: z
    .array(z.enum(equipmentOptions))
    .min(1, "Select at least one option"),
});

export type EquipmentAccessData = z.infer<typeof equipmentAccessSchema>;
