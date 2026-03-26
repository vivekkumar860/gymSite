import { apiClient } from "@/api/client";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Schemas matching backend progress DTOs
// ---------------------------------------------------------------------------

const progressEntrySchema = z.object({
  id: z.string(),
  metricType: z.string(),
  recordedValue: z.number(),
  recordedAt: z.string(),
  notes: z.string().nullable(),
});

const bodyMeasurementSchema = z.object({
  id: z.string(),
  site: z.string(),
  valueCm: z.number(),
  measuredAt: z.string(),
  notes: z.string().nullable(),
});

const progressPhotoSchema = z.object({
  id: z.string(),
  pose: z.string(),
  storagePath: z.string(),
  takenAt: z.string(),
  notes: z.string().nullable(),
});

const progressSummarySchema = z.object({
  totalWorkouts: z.number(),
  latestBodyWeight: z.number().nullable(),
  activeGoalsCount: z.number(),
  currentHabitStreaks: z.array(z.object({
    habitName: z.string(),
    streak: z.number(),
  })),
});

export type ProgressEntry = z.infer<typeof progressEntrySchema>;
export type BodyMeasurement = z.infer<typeof bodyMeasurementSchema>;
export type ProgressPhoto = z.infer<typeof progressPhotoSchema>;
export type ProgressSummary = z.infer<typeof progressSummarySchema>;

// ---------------------------------------------------------------------------
// Progress Service
// ---------------------------------------------------------------------------

export async function getSummary(): Promise<ProgressSummary> {
  return apiClient.get("/progress/summary", progressSummarySchema);
}

export async function getMeasurements(): Promise<BodyMeasurement[]> {
  return apiClient.get("/progress/measurements", z.array(bodyMeasurementSchema));
}

export async function addMeasurement(data: {
  site: string;
  valueCm: number;
  measuredAt: string;
  notes?: string;
}): Promise<BodyMeasurement> {
  return apiClient.post("/progress/measurements", data, bodyMeasurementSchema);
}

export async function getEntries(metricType: string): Promise<ProgressEntry[]> {
  return apiClient.get("/progress/entries", z.array(progressEntrySchema), { metricType });
}

export async function addEntry(data: {
  metricType: string;
  recordedValue: number;
  recordedAt: string;
  notes?: string;
}): Promise<ProgressEntry> {
  return apiClient.post("/progress/entries", data, progressEntrySchema);
}

export async function getProgressPhotos(): Promise<ProgressPhoto[]> {
  return apiClient.get("/progress/photos", z.array(progressPhotoSchema));
}

export async function deletePhoto(photoId: string): Promise<void> {
  return apiClient.delete(`/progress/photos/${photoId}`);
}
