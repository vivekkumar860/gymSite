/** AI-generated workout adjustment suggestion. */
export interface WorkoutSuggestionDto {
  adjustmentType:
    | 'increase_volume'
    | 'decrease_volume'
    | 'swap_exercise'
    | 'deload'
    | 'maintain';
  reasoning: string;
  suggestedExercises: {
    name: string;
    sets: number;
    reps: number;
    restSeconds: number;
  }[];
  confidenceNote: string;
}
