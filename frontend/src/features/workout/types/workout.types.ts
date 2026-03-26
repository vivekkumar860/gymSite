export type {
  Workout,
  WorkoutSummary,
  WorkoutExercise,
  ExerciseSet,
} from "@/api/schemas/workout.schema";

export type WorkoutStatus = "planned" | "in_progress" | "completed" | "skipped";

/** Shape collected by the set-logger form. Converted to backend DTO before sending. */
export type LogSetFormValues = {
  reps: number;
  weight: number;
  weightUnit: "kg" | "lbs";
  isWarmup: boolean;
  isDropSet: boolean;
  rpe?: number;
};

const LBS_TO_KG = 0.453592;

/** Convert form values into the shape the backend LogSetDto expects. */
export function toLogSetDto(
  values: LogSetFormValues,
  exerciseId: string,
  setNumber: number,
) {
  const weightKg =
    values.weightUnit === "lbs"
      ? Math.round(values.weight * LBS_TO_KG * 100) / 100
      : values.weight;

  return {
    exerciseId,
    setNumber,
    weightKg: weightKg || undefined,
    repsCompleted: values.reps,
    rpe: values.rpe,
    isWarmup: values.isWarmup,
    isFailure: values.isDropSet,
  };
}
