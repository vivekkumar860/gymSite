/** Domain representation of a user goal. */
export interface GoalDomain {
  id: string;
  userId: string;
  goalType: string;
  title: string;
  description: string | null;
  targetValue: number | null;
  targetUnit: string | null;
  currentValue: number | null;
  deadline: Date | null;
  goalStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Domain representation of a goal milestone. */
export interface GoalMilestoneDomain {
  id: string;
  goalId: string;
  title: string;
  targetValue: number | null;
  milestoneOrder: number;
  isAchieved: boolean;
  achievedAt: Date | null;
}
