import type {
  WorkoutPlan,
  WorkoutDay,
  WorkoutDayExercise,
  WorkoutSession,
  WorkoutSetLog,
  Exercise,
} from '@prisma/client';
import type {
  WorkoutPlanDomain,
  WorkoutDayDomain,
  WorkoutDayDetailDomain,
  WorkoutDayExerciseDomain,
  WorkoutSessionDomain,
  WorkoutSetLogDomain,
} from '../domain/workout';
import type {
  WorkoutPlanResponseDto,
  WorkoutDayResponseDto,
  WorkoutDayDetailResponseDto,
  WorkoutDayExerciseResponseDto,
  WorkoutSessionResponseDto,
  WorkoutSetLogResponseDto,
} from '../dto/workout-response.dto';

/** Maps between Prisma workout models, domain types, and response DTOs. */
export class WorkoutMapper {
  static planToDomain(record: WorkoutPlan): WorkoutPlanDomain {
    return {
      id: record.id,
      userId: record.userId,
      planName: record.planName,
      description: record.description,
      planStatus: record.planStatus,
      goalId: record.goalId,
      durationWeeks: record.durationWeeks,
      daysPerWeek: record.daysPerWeek,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  static planToResponse(domain: WorkoutPlanDomain): WorkoutPlanResponseDto {
    return {
      id: domain.id,
      planName: domain.planName,
      description: domain.description,
      planStatus: domain.planStatus,
      goalId: domain.goalId,
      durationWeeks: domain.durationWeeks,
      daysPerWeek: domain.daysPerWeek,
      createdAt: domain.createdAt.toISOString(),
    };
  }

  static dayToDomain(record: WorkoutDay): WorkoutDayDomain {
    return {
      id: record.id,
      planId: record.planId,
      dayName: record.dayName,
      dayOrder: record.dayOrder,
      focusArea: record.focusArea,
      scheduledDate: record.scheduledDate,
    };
  }

  static dayToResponse(domain: WorkoutDayDomain): WorkoutDayResponseDto {
    return {
      id: domain.id,
      dayName: domain.dayName,
      dayOrder: domain.dayOrder,
      focusArea: domain.focusArea,
      scheduledDate: domain.scheduledDate?.toISOString().split('T')[0] ?? null,
    };
  }

  /** Map a Prisma day with included exercises (and their exercise names) to the detail domain type. */
  static dayDetailToDomain(
    record: WorkoutDay & {
      exercises: (WorkoutDayExercise & { exercise: Pick<Exercise, 'exerciseName'> })[];
    },
  ): WorkoutDayDetailDomain {
    return {
      id: record.id,
      planId: record.planId,
      dayName: record.dayName,
      dayOrder: record.dayOrder,
      focusArea: record.focusArea,
      scheduledDate: record.scheduledDate,
      exercises: record.exercises.map(WorkoutMapper.dayExerciseToDomain),
    };
  }

  /** Map a day detail domain to response DTO. */
  static dayDetailToResponse(
    domain: WorkoutDayDetailDomain,
  ): WorkoutDayDetailResponseDto {
    return {
      id: domain.id,
      dayName: domain.dayName,
      dayOrder: domain.dayOrder,
      focusArea: domain.focusArea,
      scheduledDate: domain.scheduledDate?.toISOString().split('T')[0] ?? null,
      exercises: domain.exercises.map(WorkoutMapper.dayExerciseToResponse),
    };
  }

  static dayExerciseToDomain(
    record: WorkoutDayExercise & { exercise?: Pick<Exercise, 'exerciseName'> },
  ): WorkoutDayExerciseDomain {
    return {
      id: record.id,
      dayId: record.dayId,
      exerciseId: record.exerciseId,
      exerciseName: record.exercise?.exerciseName ?? 'Unknown Exercise',
      exerciseOrder: record.exerciseOrder,
      targetSets: record.targetSets,
      targetRepsMin: record.targetRepsMin,
      targetRepsMax: record.targetRepsMax,
      restSeconds: record.restSeconds,
      notes: record.notes,
    };
  }

  static dayExerciseToResponse(
    domain: WorkoutDayExerciseDomain,
  ): WorkoutDayExerciseResponseDto {
    return {
      id: domain.id,
      exerciseId: domain.exerciseId,
      exerciseName: domain.exerciseName,
      exerciseOrder: domain.exerciseOrder,
      targetSets: domain.targetSets,
      targetRepsMin: domain.targetRepsMin,
      targetRepsMax: domain.targetRepsMax,
      restSeconds: domain.restSeconds,
      notes: domain.notes,
    };
  }

  static sessionToDomain(record: WorkoutSession): WorkoutSessionDomain {
    return {
      id: record.id,
      userId: record.userId,
      dayId: record.dayId,
      sessionStatus: record.sessionStatus,
      startedAt: record.startedAt,
      completedAt: record.completedAt,
      notes: record.notes,
      rating: record.rating,
    };
  }

  static sessionToResponse(
    domain: WorkoutSessionDomain,
  ): WorkoutSessionResponseDto {
    return {
      id: domain.id,
      dayId: domain.dayId,
      sessionStatus: domain.sessionStatus,
      startedAt: domain.startedAt.toISOString(),
      completedAt: domain.completedAt?.toISOString() ?? null,
      notes: domain.notes,
      rating: domain.rating,
      exerciseCount: domain.exerciseCount ?? 0,
      totalSets: domain.totalSets ?? 0,
      totalVolume: domain.totalVolume ?? 0,
    };
  }

  static setLogToDomain(record: WorkoutSetLog): WorkoutSetLogDomain {
    return {
      id: record.id,
      sessionId: record.sessionId,
      exerciseId: record.exerciseId,
      setNumber: record.setNumber,
      weightKg: record.weightKg ? Number(record.weightKg) : null,
      repsCompleted: record.repsCompleted,
      rpe: record.rpe ? Number(record.rpe) : null,
      isWarmup: record.isWarmup,
      isFailure: record.isFailure,
    };
  }

  static setLogToResponse(
    domain: WorkoutSetLogDomain,
  ): WorkoutSetLogResponseDto {
    return {
      id: domain.id,
      exerciseId: domain.exerciseId,
      setNumber: domain.setNumber,
      weightKg: domain.weightKg,
      repsCompleted: domain.repsCompleted,
      rpe: domain.rpe,
      isWarmup: domain.isWarmup,
      isFailure: domain.isFailure,
    };
  }
}
