/** Context provided to the AI engine for missed workout recovery. */
export interface MissedWorkoutContextDto {
  userId: string;
  missedWorkoutName: string;
  missedDate: string;
  daysMissed: number;
  currentWeekPlan: string[];
  fitnessGoal: string;
}
