/**
 * Reusable test data factories.
 * Call each factory to get a fresh object — override any field via the partial param.
 */

export function buildUser(overrides: Record<string, unknown> = {}) {
  return {
    id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
    role: 'MEMBER',
    accountStatus: 'ACTIVE',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    ...overrides,
  };
}

export function buildAuthUser(overrides: Record<string, unknown> = {}) {
  return {
    id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
    role: 'MEMBER',
    accountStatus: 'ACTIVE',
    passwordHash: '$2b$12$hashedpassword',
    emailVerifiedAt: null,
    failedLoginCount: 0,
    lockedUntil: null,
    ...overrides,
  };
}

export function buildExercise(overrides: Record<string, unknown> = {}) {
  return {
    id: 'ex-1',
    exerciseName: 'Bench Press',
    primaryMuscle: 'CHEST',
    secondaryMuscle: 'TRICEPS',
    equipment: 'BARBELL',
    difficulty: 'INTERMEDIATE',
    instructions: 'Lie flat on bench, press bar up.',
    videoUrl: null,
    isCompound: true,
    isActive: true,
    createdBy: 'user-1',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    ...overrides,
  };
}

export function buildWorkoutPlan(overrides: Record<string, unknown> = {}) {
  return {
    id: 'plan-1',
    userId: 'user-1',
    planName: 'Push Pull Legs',
    description: 'Classic PPL split',
    planStatus: 'ACTIVE',
    goalId: null,
    durationWeeks: 12,
    daysPerWeek: 6,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    ...overrides,
  };
}

export function buildTokenPair() {
  return {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    refreshTokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };
}

export function buildJwtPayload(overrides: Record<string, unknown> = {}) {
  return {
    sub: 'user-1',
    email: 'test@example.com',
    role: 'MEMBER',
    ...overrides,
  };
}
