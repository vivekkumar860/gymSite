import { z } from 'zod';

export const motivationalSummarySchema = z.object({
  headline: z.string().min(3).max(100),
  body: z.string().min(10).max(500),
  callToAction: z.string().min(3).max(200),
});
