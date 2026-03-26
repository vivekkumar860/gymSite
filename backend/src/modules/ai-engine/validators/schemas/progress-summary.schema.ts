import { z } from 'zod';

export const progressSummarySchema = z.object({
  trend: z.enum(['improving', 'plateau', 'declining']),
  summary: z.string().min(10).max(500),
  keyInsight: z.string().min(5).max(300),
  suggestion: z.string().min(5).max(300),
});
