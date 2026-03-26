import type { WorkoutPlanDomain } from '../domain/workout';
import type { CreateWorkoutPlanDto } from '../dto/create-workout-plan.dto';
import type { UpdateWorkoutPlanDto } from '../dto/update-workout-plan.dto';

/** Data for creating a generated plan with days and exercises in one transaction. */
export interface GeneratedPlanData {
  planName: string;
  description: string;
  daysPerWeek: number;
  durationWeeks: number;
  days: GeneratedDayData[];
}

/** Data for a single generated workout day. */
export interface GeneratedDayData {
  dayName: string;
  dayOrder: number;
  focusArea: string;
  scheduledDate?: Date;
  exercises: GeneratedDayExerciseData[];
}

/** Data for a single exercise within a generated day. */
export interface GeneratedDayExerciseData {
  exerciseId: string;
  exerciseOrder: number;
  targetSets: number;
  targetRepsMin: number;
  targetRepsMax: number;
  restSeconds: number;
}

/**
 * Contract for workout plan data access.
 */
export interface IWorkoutPlanRepository {
  /** Find a plan by ID. */
  findById(id: string): Promise<WorkoutPlanDomain | null>;

  /** Find all plans for a user. */
  findByUserId(userId: string): Promise<WorkoutPlanDomain[]>;

  /** Find the active plan for a user. Returns null if no plan is active. */
  findActivePlanByUserId(userId: string): Promise<WorkoutPlanDomain | null>;

  /** Create a manual workout plan. */
  create(
    userId: string,
    data: CreateWorkoutPlanDto,
  ): Promise<WorkoutPlanDomain>;

  /** Create a generated plan with days and exercises in a single transaction. */
  createGeneratedPlan(
    userId: string,
    data: GeneratedPlanData,
  ): Promise<WorkoutPlanDomain>;

  /** Deactivate all plans for a user (set status to PAUSED). */
  deactivateAllForUser(userId: string): Promise<void>;

  /** Update a workout plan. */
  update(id: string, data: UpdateWorkoutPlanDto): Promise<WorkoutPlanDomain>;

  /** Delete a workout plan. */
  delete(id: string): Promise<void>;
}

/** DI token for IWorkoutPlanRepository. */
export const WORKOUT_PLAN_REPOSITORY = Symbol('WORKOUT_PLAN_REPOSITORY');
