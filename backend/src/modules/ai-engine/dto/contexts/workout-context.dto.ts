/** Context provided to the AI engine for workout adjustment suggestions. */
export interface WorkoutContextDto {
  userId: string;
  currentPlanSummary: string;
  recentSessionLogs: string[];
  fitnessGoal: string;
  availableEquipment: string[];
  injuryNotes?: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
}
