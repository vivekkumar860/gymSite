export type {
  Measurement,
  ExerciseProgress,
  ProgressPhoto,
} from "@/api/schemas/progress.schema";

export type MeasurementFormValues = {
  weight?: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  thighs?: number;
  notes?: string;
};
