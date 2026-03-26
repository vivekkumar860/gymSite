import { PrismaService } from '../../src/infrastructure/database/prisma.service';

/**
 * Creates a mock PrismaService for unit tests.
 * Each model delegate is pre-populated with jest.fn() for common operations.
 */
export function createMockPrismaService(): jest.Mocked<PrismaService> {
  const modelMock = () => ({
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    upsert: jest.fn(),
  });

  return {
    user: modelMock(),
    authCredential: modelMock(),
    authSession: modelMock(),
    profile: modelMock(),
    onboardingCompletion: modelMock(),
    exercise: modelMock(),
    workoutPlan: modelMock(),
    workoutDay: modelMock(),
    workoutDayExercise: modelMock(),
    workoutSession: modelMock(),
    workoutSetLog: modelMock(),
    nutritionPlan: modelMock(),
    mealTemplate: modelMock(),
    habitDefinition: modelMock(),
    habitEntry: modelMock(),
    progressEntry: modelMock(),
    bodyMeasurement: modelMock(),
    progressPhoto: modelMock(),
    goal: modelMock(),
    goalMilestone: modelMock(),
    adminAuditLog: modelMock(),
    $transaction: jest.fn((fn) => fn()),
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    onModuleInit: jest.fn(),
    onModuleDestroy: jest.fn(),
  } as unknown as jest.Mocked<PrismaService>;
}
