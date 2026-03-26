import { Inject, Injectable } from '@nestjs/common';
import { resolveSplitStrategy } from '../strategies/split-strategy-resolver';
import { resolveRepScheme } from '../strategies/rep-scheme.config';
import { EXERCISE_REPOSITORY } from '../../exercises/interfaces';
import type { IExerciseRepository } from '../../exercises/interfaces';
import type { ExerciseDomain } from '../../exercises/domain/exercise';
import type { GenerateWorkoutPlanDto } from '../dto/generate-workout-plan.dto';
import type {
  GeneratedPlanData,
  GeneratedDayData,
  GeneratedDayExerciseData,
} from '../interfaces';
import type { SplitDayDefinition } from '../strategies/workout-split-strategy.interface';
import type { RepScheme } from '../strategies/rep-scheme.config';

const EXERCISES_PER_DAY_DEFAULT = 5;
const EXERCISES_PER_DAY_SHORT_SESSION = 4;
const SHORT_SESSION_THRESHOLD_MINUTES = 40;

/**
 * Assembles a complete workout plan blueprint from generation inputs.
 * Coordinates strategy selection, exercise filtering, and rep scheme assignment.
 */
@Injectable()
export class WorkoutPlanFactory {
  constructor(
    @Inject(EXERCISE_REPOSITORY)
    private readonly exerciseRepo: IExerciseRepository,
  ) {}

  /** Build a complete plan data structure ready for persistence. */
  async createPlanBlueprint(
    dto: GenerateWorkoutPlanDto,
  ): Promise<GeneratedPlanData> {
    const strategy = resolveSplitStrategy(dto.daysPerWeek, dto.goal);
    const dayDefinitions = strategy.generateDays(dto.daysPerWeek);
    const repScheme = resolveRepScheme(dto.goal);
    const exercisesPerDay = this.calculateExercisesPerDay(
      dto.sessionDurationMinutes,
    );

    const allExercises = await this.loadAvailableExercises(
      dto.availableEquipment,
    );
    const days = this.buildDays(
      dayDefinitions,
      allExercises,
      repScheme,
      exercisesPerDay,
    );

    return {
      planName: this.generatePlanName(dto.goal, dto.daysPerWeek),
      description: this.generateDescription(dto),
      daysPerWeek: dto.daysPerWeek,
      durationWeeks: dto.durationWeeks,
      days,
    };
  }

  private calculateExercisesPerDay(sessionMinutes: number): number {
    return sessionMinutes <= SHORT_SESSION_THRESHOLD_MINUTES
      ? EXERCISES_PER_DAY_SHORT_SESSION
      : EXERCISES_PER_DAY_DEFAULT;
  }

  private async loadAvailableExercises(
    equipment: string[],
  ): Promise<ExerciseDomain[]> {
    const result = await this.exerciseRepo.findMany({
      page: 1,
      limit: 500,
    });
    return result.data.filter((ex) => equipment.includes(ex.equipment));
  }

  private buildDays(
    dayDefs: SplitDayDefinition[],
    allExercises: ExerciseDomain[],
    repScheme: RepScheme,
    exercisesPerDay: number,
  ): GeneratedDayData[] {
    return dayDefs.map((dayDef) => {
      const matched = this.selectExercisesForDay(
        dayDef.targetMuscleGroups,
        allExercises,
        exercisesPerDay,
      );
      const exercises = this.assignRepScheme(matched, repScheme);

      return {
        dayName: dayDef.dayName,
        dayOrder: dayDef.dayOrder,
        focusArea: dayDef.focusArea,
        exercises,
      };
    });
  }

  private selectExercisesForDay(
    targetMuscles: string[],
    allExercises: ExerciseDomain[],
    count: number,
  ): ExerciseDomain[] {
    const matching = allExercises.filter((ex) =>
      targetMuscles.includes(ex.primaryMuscle),
    );

    const compounds = matching.filter((ex) => ex.isCompound);
    const isolations = matching.filter((ex) => !ex.isCompound);

    const selected: ExerciseDomain[] = [];
    selected.push(...compounds.slice(0, Math.ceil(count / 2)));

    const remaining = count - selected.length;
    selected.push(...isolations.slice(0, remaining));

    if (selected.length < count) {
      const extras = matching
        .filter((ex) => !selected.includes(ex))
        .slice(0, count - selected.length);
      selected.push(...extras);
    }

    return selected;
  }

  private assignRepScheme(
    exercises: ExerciseDomain[],
    repScheme: RepScheme,
  ): GeneratedDayExerciseData[] {
    return exercises.map((ex, index) => ({
      exerciseId: ex.id,
      exerciseOrder: index + 1,
      targetSets: repScheme.targetSets,
      targetRepsMin: repScheme.targetRepsMin,
      targetRepsMax: repScheme.targetRepsMax,
      restSeconds: ex.isCompound
        ? repScheme.compoundRestSeconds
        : repScheme.restSeconds,
    }));
  }

  private generatePlanName(goal: string, daysPerWeek: number): string {
    const goalLabel = goal.replace(/_/g, ' ').toLowerCase();
    return `${daysPerWeek}-Day ${goalLabel} plan`;
  }

  private generateDescription(dto: GenerateWorkoutPlanDto): string {
    return [
      `${dto.durationWeeks}-week program`,
      `${dto.daysPerWeek} days/week`,
      `~${dto.sessionDurationMinutes} min sessions`,
      `Goal: ${dto.goal.replace(/_/g, ' ')}`,
    ].join(' · ');
  }
}
