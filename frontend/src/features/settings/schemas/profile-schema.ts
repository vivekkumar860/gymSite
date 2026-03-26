import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
