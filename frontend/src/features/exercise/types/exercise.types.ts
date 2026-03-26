export type { Exercise, ExerciseSummary } from "@/api/schemas/exercise.schema";

export type ExerciseFilters = {
  search?: string;
  primaryMuscle?: string;
  equipment?: string;
  difficulty?: string;
};
