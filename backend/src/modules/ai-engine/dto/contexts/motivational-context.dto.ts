/** Context provided to the AI engine for motivational summaries. */
export interface MotivationalContextDto {
  userId: string;
  currentStreak: number;
  recentAchievements: string[];
  upcomingGoals: string[];
  preferredTone: 'encouraging' | 'direct' | 'casual';
}
