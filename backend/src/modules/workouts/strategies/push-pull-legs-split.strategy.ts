import type {
  IWorkoutSplitStrategy,
  SplitDayDefinition,
} from './workout-split-strategy.interface';

const PPL_TEMPLATE: SplitDayDefinition[] = [
  {
    dayName: 'Push',
    dayOrder: 1,
    focusArea: 'Push',
    targetMuscleGroups: ['CHEST', 'SHOULDERS', 'TRICEPS'],
  },
  {
    dayName: 'Pull',
    dayOrder: 2,
    focusArea: 'Pull',
    targetMuscleGroups: ['BACK', 'BICEPS', 'FOREARMS'],
  },
  {
    dayName: 'Legs',
    dayOrder: 3,
    focusArea: 'Legs',
    targetMuscleGroups: ['QUADRICEPS', 'HAMSTRINGS', 'GLUTES', 'CALVES'],
  },
];

/**
 * Push/Pull/Legs split strategy.
 * Cycles through Push → Pull → Legs for the requested number of days.
 * Best for 3 or 6 days per week.
 */
export class PushPullLegsSplitStrategy implements IWorkoutSplitStrategy {
  /** Generate PPL days, cycling the template for more than 3 days. */
  generateDays(daysPerWeek: number): SplitDayDefinition[] {
    return Array.from({ length: daysPerWeek }, (_, i) => {
      const template = PPL_TEMPLATE[i % PPL_TEMPLATE.length];
      const cycle = Math.floor(i / PPL_TEMPLATE.length) + 1;
      const suffix = daysPerWeek > PPL_TEMPLATE.length ? ` ${cycle}` : '';

      return {
        ...template,
        dayName: `${template.dayName}${suffix}`,
        dayOrder: i + 1,
      };
    });
  }
}
