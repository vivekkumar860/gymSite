import { PushPullLegsSplitStrategy } from '../strategies/push-pull-legs-split.strategy';
import { UpperLowerSplitStrategy } from '../strategies/upper-lower-split.strategy';
import { FullBodySplitStrategy } from '../strategies/full-body-split.strategy';
import { resolveSplitStrategy } from '../strategies/split-strategy-resolver';
import { resolveRepScheme } from '../strategies/rep-scheme.config';

describe('PushPullLegsSplitStrategy', () => {
  const strategy = new PushPullLegsSplitStrategy();

  it('should generate 3 days for 3 days/week', () => {
    const days = strategy.generateDays(3);
    expect(days).toHaveLength(3);
    expect(days[0].dayName).toBe('Push');
    expect(days[1].dayName).toBe('Pull');
    expect(days[2].dayName).toBe('Legs');
  });

  it('should cycle with suffixes for 6 days/week', () => {
    const days = strategy.generateDays(6);
    expect(days).toHaveLength(6);
    expect(days[0].dayName).toBe('Push 1');
    expect(days[3].dayName).toBe('Push 2');
  });

  it('should assign target muscle groups', () => {
    const days = strategy.generateDays(3);
    expect(days[0].targetMuscleGroups).toContain('CHEST');
    expect(days[1].targetMuscleGroups).toContain('BACK');
    expect(days[2].targetMuscleGroups).toContain('QUADRICEPS');
  });
});

describe('UpperLowerSplitStrategy', () => {
  const strategy = new UpperLowerSplitStrategy();

  it('should alternate upper and lower for 4 days', () => {
    const days = strategy.generateDays(4);
    expect(days).toHaveLength(4);
    expect(days[0].focusArea).toBe('Upper Body');
    expect(days[1].focusArea).toBe('Lower Body');
    expect(days[2].focusArea).toBe('Upper Body');
    expect(days[3].focusArea).toBe('Lower Body');
  });

  it('should number days correctly', () => {
    const days = strategy.generateDays(4);
    expect(days[0].dayName).toBe('Upper 1');
    expect(days[2].dayName).toBe('Upper 2');
  });
});

describe('FullBodySplitStrategy', () => {
  const strategy = new FullBodySplitStrategy();

  it('should generate full body days', () => {
    const days = strategy.generateDays(3);
    expect(days).toHaveLength(3);
    expect(days[0].focusArea).toBe('Full Body');
    expect(days[0].targetMuscleGroups).toContain('CHEST');
    expect(days[0].targetMuscleGroups).toContain('BACK');
  });
});

describe('resolveSplitStrategy', () => {
  it('should return FullBody for 2 days, non-muscle-gain goal', () => {
    const strategy = resolveSplitStrategy(2, 'LOSE_WEIGHT');
    expect(strategy).toBeInstanceOf(FullBodySplitStrategy);
  });

  it('should return UpperLower for 3 days, muscle gain goal', () => {
    const strategy = resolveSplitStrategy(3, 'GAIN_MUSCLE');
    expect(strategy).toBeInstanceOf(UpperLowerSplitStrategy);
  });

  it('should return UpperLower for 4 days', () => {
    const strategy = resolveSplitStrategy(4, 'MAINTAIN');
    expect(strategy).toBeInstanceOf(UpperLowerSplitStrategy);
  });

  it('should return PPL for 5+ days', () => {
    const strategy = resolveSplitStrategy(5, 'GAIN_MUSCLE');
    expect(strategy).toBeInstanceOf(PushPullLegsSplitStrategy);
  });
});

describe('resolveRepScheme', () => {
  it('should return strength scheme for INCREASE_STRENGTH', () => {
    const scheme = resolveRepScheme('INCREASE_STRENGTH');
    expect(scheme.targetSets).toBe(5);
    expect(scheme.targetRepsMin).toBe(3);
    expect(scheme.targetRepsMax).toBe(5);
  });

  it('should return hypertrophy scheme for GAIN_MUSCLE', () => {
    const scheme = resolveRepScheme('GAIN_MUSCLE');
    expect(scheme.targetRepsMin).toBe(8);
    expect(scheme.targetRepsMax).toBe(12);
  });

  it('should return endurance scheme for LOSE_WEIGHT', () => {
    const scheme = resolveRepScheme('LOSE_WEIGHT');
    expect(scheme.targetRepsMin).toBe(15);
  });

  it('should fallback to maintenance for unknown goal', () => {
    const scheme = resolveRepScheme('UNKNOWN');
    expect(scheme.targetSets).toBe(3);
  });
});
