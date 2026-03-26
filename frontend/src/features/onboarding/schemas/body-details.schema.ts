import { z } from "zod";

export const bodyDetailsSchema = z.object({
  height: z
    .number({ message: "Enter a valid number" })
    .positive("Height must be positive")
    .max(300, "Height seems too high")
    .optional()
    .or(z.literal(undefined)),
  weight: z
    .number({ message: "Enter a valid number" })
    .positive("Weight must be positive")
    .max(500, "Weight seems too high")
    .optional()
    .or(z.literal(undefined)),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
});

export type BodyDetailsData = z.infer<typeof bodyDetailsSchema>;
