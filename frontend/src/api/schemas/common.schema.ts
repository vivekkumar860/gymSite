import { z, ZodSchema } from "zod";

// ---------------------------------------------------------------------------
// Paginated response wrapper
// ---------------------------------------------------------------------------

export function paginatedResponseSchema<T extends ZodSchema>(
  itemSchema: T,
) {
  return z.object({
    data: z.array(itemSchema),
    meta: z.object({
      page: z.number(),
      limit: z.number(),
      totalCount: z.number(),
      totalPages: z.number(),
    }),
  });
}

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
};

// ---------------------------------------------------------------------------
// API success wrapper
// ---------------------------------------------------------------------------

export function apiSuccessSchema<T extends ZodSchema>(dataSchema: T) {
  return z.object({
    data: dataSchema,
    message: z.string().optional(),
  });
}

export type ApiSuccess<T> = {
  data: T;
  message?: string;
};

// ---------------------------------------------------------------------------
// API error shape
// ---------------------------------------------------------------------------

export const apiErrorSchema = z.object({
  message: z.string(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
});

export type ApiErrorResponse = z.infer<typeof apiErrorSchema>;
