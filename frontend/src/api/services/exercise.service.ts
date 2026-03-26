import { apiClient, type QueryParams } from "@/api/client";
import { paginatedResponseSchema } from "@/api/schemas/common.schema";
import {
  exerciseSchema,
  exerciseSummarySchema,
  type Exercise,
  type ExerciseSummary,
} from "@/api/schemas/exercise.schema";

// ---------------------------------------------------------------------------
// Exercise Service
// ---------------------------------------------------------------------------

const exerciseListSchema = paginatedResponseSchema(exerciseSummarySchema);

export async function getExercises(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    primaryMuscle?: string;
    equipment?: string;
    difficulty?: string;
  } = {},
): Promise<{
  data: ExerciseSummary[];
  meta: { page: number; limit: number; totalCount: number; totalPages: number };
}> {
  return apiClient.get("/exercises", exerciseListSchema, params as QueryParams);
}

export async function getExerciseBySlug(slug: string): Promise<Exercise> {
  return apiClient.get(`/exercises/${slug}`, exerciseSchema);
}

export async function searchExercises(
  query: string,
): Promise<{
  data: ExerciseSummary[];
  meta: { page: number; limit: number; totalCount: number; totalPages: number };
}> {
  return apiClient.get("/exercises", exerciseListSchema, { search: query });
}
