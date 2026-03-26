/** AI-generated recovery plan for missed workouts. */
export interface RecoverySuggestionDto {
  strategy: 'reschedule' | 'merge' | 'skip_and_continue';
  reasoning: string;
  adjustedSchedule: {
    day: string;
    workoutName: string;
  }[];
  motivationalNote: string;
}
