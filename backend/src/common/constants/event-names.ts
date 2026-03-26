/** Domain event names used with EventEmitter2. */
export const DOMAIN_EVENTS = {
  USER_REGISTERED: 'user.registered',
  USER_LOGGED_IN: 'user.logged_in',
  PASSWORD_RESET_REQUESTED: 'auth.password_reset_requested',
  PASSWORD_RESET_COMPLETED: 'auth.password_reset_completed',

  // Onboarding
  ONBOARDING_COMPLETED: 'onboarding.completed',

  WORKOUT_PLAN_CREATED: 'workout.plan.created',
  WORKOUT_SESSION_COMPLETED: 'workout.session.completed',

  NUTRITION_PLAN_CREATED: 'nutrition.plan.created',

  HABIT_ENTRY_LOGGED: 'habit.entry.logged',

  PROGRESS_ENTRY_RECORDED: 'progress.entry.recorded',

  GOAL_ACHIEVED: 'goal.achieved',
} as const;
