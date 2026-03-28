import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { z } from "zod";

const muscleDistributionSchema = z.object({
  muscle: z.string(),
  setCount: z.number(),
});

const progressSummarySchema = z.object({
  totalWorkouts: z.number(),
  totalVolume: z.number(),
  totalSets: z.number(),
  currentStreak: z.number(),
  longestStreak: z.number(),
  favoriteExercise: z.string().nullable(),
  muscleGroupDistribution: z.array(muscleDistributionSchema),
});

export type ProgressSummary = z.infer<typeof progressSummarySchema>;

async function fetchProgressSummary(): Promise<ProgressSummary> {
  return apiClient.get("/workouts/progress-summary", progressSummarySchema);
}

export function useProgressSummary() {
  return useQuery({
    queryKey: ["workouts", "progress-summary"],
    queryFn: fetchProgressSummary,
  });
}
