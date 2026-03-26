import type {
  WorkoutDayDomain,
  WorkoutDayDetailDomain,
  WorkoutDayExerciseDomain,
} from '../domain/workout';
import type { CreateWorkoutDayDto } from '../dto/create-workout-day.dto';
import type { AddDayExerciseDto } from '../dto/add-day-exercise.dto';

/**
 * Contract for workout day and day-exercise data access.
 */
export interface IWorkoutDayRepository {
  /** Find a day by ID. */
  findById(id: string): Promise<WorkoutDayDomain | null>;

  /** Find a day by ID with its exercises included (detail view). */
  findByIdWithExercises(id: string): Promise<WorkoutDayDetailDomain | null>;

  /** Find all days for a plan, ordered by dayOrder. */
  findByPlanId(planId: string): Promise<WorkoutDayDomain[]>;

  /** Create a workout day within a plan. */
  create(planId: string, data: CreateWorkoutDayDto): Promise<WorkoutDayDomain>;

  /** Delete a workout day. */
  delete(id: string): Promise<void>;

  /** Reschedule a day to a new date. */
  reschedule(dayId: string, newDate: Date): Promise<WorkoutDayDomain>;

  /** Find all exercises for a day, ordered by exerciseOrder. */
  findExercisesByDayId(dayId: string): Promise<WorkoutDayExerciseDomain[]>;

  /** Add an exercise to a day. */
  addExercise(
    dayId: string,
    data: AddDayExerciseDto,
  ): Promise<WorkoutDayExerciseDomain>;

  /** Remove an exercise entry from a day. */
  removeExercise(exerciseEntryId: string): Promise<void>;
}

/** DI token for IWorkoutDayRepository. */
export const WORKOUT_DAY_REPOSITORY = Symbol('WORKOUT_DAY_REPOSITORY');
