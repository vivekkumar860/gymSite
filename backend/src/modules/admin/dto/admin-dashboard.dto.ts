/** Platform-wide dashboard stats. */
export interface AdminDashboardDto {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalExercises: number;
  totalWorkoutSessions: number;
  totalGoals: number;
  newUsersToday: number;
  newUsersThisWeek: number;
}
