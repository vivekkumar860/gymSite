/** Shape of a goal response. */
export interface GoalResponseDto {
  id: string;
  goalType: string;
  title: string;
  description: string | null;
  targetValue: number | null;
  targetUnit: string | null;
  currentValue: number | null;
  deadline: string | null;
  goalStatus: string;
  progressPct: number;
  createdAt: string;
}

/** Shape of a milestone response. */
export interface MilestoneResponseDto {
  id: string;
  title: string;
  targetValue: number | null;
  milestoneOrder: number;
  isAchieved: boolean;
  achievedAt: string | null;
}
