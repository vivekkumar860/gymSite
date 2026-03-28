/** Domain representation of an exercise in the catalog. */
export interface ExerciseDomain {
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
  imageUrl: string | null;
  isCompound: boolean;
  isActive: boolean;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}
