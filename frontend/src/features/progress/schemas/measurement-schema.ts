import { z } from "zod";

export const MEASUREMENT_SITES = [
  "NECK",
  "CHEST",
  "LEFT_BICEP",
  "RIGHT_BICEP",
  "WAIST",
  "HIPS",
  "LEFT_THIGH",
  "RIGHT_THIGH",
  "LEFT_CALF",
  "RIGHT_CALF",
] as const;

export const MEASUREMENT_SITE_LABELS: Record<
  (typeof MEASUREMENT_SITES)[number],
  string
> = {
  NECK: "Neck",
  CHEST: "Chest",
  LEFT_BICEP: "Left Bicep",
  RIGHT_BICEP: "Right Bicep",
  WAIST: "Waist",
  HIPS: "Hips",
  LEFT_THIGH: "Left Thigh",
  RIGHT_THIGH: "Right Thigh",
  LEFT_CALF: "Left Calf",
  RIGHT_CALF: "Right Calf",
};

export const measurementFormSchema = z.object({
  site: z.enum(MEASUREMENT_SITES, {
    error: "Please select a measurement site",
  }),
  valueCm: z.number().positive("Value must be positive"),
  measuredAt: z.string().min(1, "Date is required"),
  notes: z.string().max(300, "Notes must be 300 characters or less").optional(),
});

export type MeasurementFormSchema = z.infer<typeof measurementFormSchema>;
