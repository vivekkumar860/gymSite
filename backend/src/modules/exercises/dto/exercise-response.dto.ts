/** Shape of the exercise response returned to the client. */
export interface ExerciseResponseDto {
  id: string;
  exerciseName: string;
  slug: string;
  primaryMuscle: string;
  secondaryMuscle: string | null;
  equipment: string;
  difficulty: string;
  movementPattern: string | null;
  instructions: string | null;
  videoUrl: string | null;
  isCompound: boolean;
  isActive: boolean;
}
