import { z } from 'zod';

/** Zod schema for creating a goal milestone. */
export const CreateMilestoneSchema = z.object({
  title: z.string().trim().min(1).max(100),
  targetValue: z.number().min(0).optional(),
  milestoneOrder: z.number().int().min(1).max(20),
});

export type CreateMilestoneDto = z.infer<typeof CreateMilestoneSchema>;
