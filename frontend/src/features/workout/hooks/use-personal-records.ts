import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { z } from "zod";

const personalRecordSchema = z.object({
  exerciseId: z.string(),
  exerciseName: z.string(),
  maxWeight: z.number(),
  maxReps: z.number(),
  maxVolume: z.number(),
  achievedAt: z.string(),
});

export type PersonalRecord = z.infer<typeof personalRecordSchema>;

async function fetchPersonalRecords(): Promise<PersonalRecord[]> {
  return apiClient.get("/workouts/personal-records", z.array(personalRecordSchema));
}

export function usePersonalRecords() {
  return useQuery({
    queryKey: ["workouts", "personal-records"],
    queryFn: fetchPersonalRecords,
  });
}
