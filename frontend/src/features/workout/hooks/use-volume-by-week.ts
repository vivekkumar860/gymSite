import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { z } from "zod";

const weeklyVolumeSchema = z.object({
  weekStart: z.string(),
  totalVolume: z.number(),
  workoutCount: z.number(),
});

export type WeeklyVolume = z.infer<typeof weeklyVolumeSchema>;

async function fetchVolumeByWeek(weeks: number): Promise<WeeklyVolume[]> {
  return apiClient.get(
    "/workouts/volume-by-week",
    z.array(weeklyVolumeSchema),
    { weeks },
  );
}

export function useVolumeByWeek(weeks = 8) {
  return useQuery({
    queryKey: ["workouts", "volume-by-week", weeks],
    queryFn: () => fetchVolumeByWeek(weeks),
  });
}
