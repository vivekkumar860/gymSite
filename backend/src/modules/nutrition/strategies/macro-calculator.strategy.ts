/** Macro split recommendation based on diet type. */
export interface MacroSplit {
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
}

/** Strategy interface for calculating recommended macro splits. */
export interface MacroCalculatorStrategy {
  calculateMacros(dailyCalories: number): MacroSplit;
}

const CALORIES_PER_GRAM_PROTEIN = 4;
const CALORIES_PER_GRAM_CARBS = 4;
const CALORIES_PER_GRAM_FAT = 9;

/** Bulking: higher carbs for energy surplus. */
export class BulkingMacroStrategy implements MacroCalculatorStrategy {
  calculateMacros(dailyCalories: number): MacroSplit {
    return { proteinPct: 0.25, carbsPct: 0.5, fatPct: 0.25 };
  }
}

/** Cutting: higher protein to preserve muscle. */
export class CuttingMacroStrategy implements MacroCalculatorStrategy {
  calculateMacros(dailyCalories: number): MacroSplit {
    return { proteinPct: 0.4, carbsPct: 0.3, fatPct: 0.3 };
  }
}

/** Maintenance: balanced split. */
export class MaintenanceMacroStrategy implements MacroCalculatorStrategy {
  calculateMacros(dailyCalories: number): MacroSplit {
    return { proteinPct: 0.3, carbsPct: 0.4, fatPct: 0.3 };
  }
}

/** Recomposition: high protein, moderate carbs. */
export class RecompositionMacroStrategy implements MacroCalculatorStrategy {
  calculateMacros(dailyCalories: number): MacroSplit {
    return { proteinPct: 0.35, carbsPct: 0.35, fatPct: 0.3 };
  }
}

/** Resolves the correct macro strategy for a diet type. */
export function resolveMacroStrategy(
  dietType: string,
): MacroCalculatorStrategy {
  const strategies: Record<string, MacroCalculatorStrategy> = {
    BULKING: new BulkingMacroStrategy(),
    CUTTING: new CuttingMacroStrategy(),
    MAINTENANCE: new MaintenanceMacroStrategy(),
    RECOMPOSITION: new RecompositionMacroStrategy(),
  };

  return strategies[dietType] ?? new MaintenanceMacroStrategy();
}

/** Convert a macro split into gram amounts. */
export function macroSplitToGrams(
  dailyCalories: number,
  split: MacroSplit,
): { proteinG: number; carbsG: number; fatG: number } {
  return {
    proteinG: Math.round(
      (dailyCalories * split.proteinPct) / CALORIES_PER_GRAM_PROTEIN,
    ),
    carbsG: Math.round(
      (dailyCalories * split.carbsPct) / CALORIES_PER_GRAM_CARBS,
    ),
    fatG: Math.round((dailyCalories * split.fatPct) / CALORIES_PER_GRAM_FAT),
  };
}
