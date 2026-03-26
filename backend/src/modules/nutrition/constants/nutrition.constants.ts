// ============================================================
// Nutrition Module — Named Constants
// ============================================================

// ── Mifflin-St Jeor BMR Coefficients ────────────────────────

/** Weight multiplier in Mifflin-St Jeor equation (kcal per kg) */
export const MIFFLIN_WEIGHT_COEFF = 10;

/** Height multiplier in Mifflin-St Jeor equation (kcal per cm) */
export const MIFFLIN_HEIGHT_COEFF = 6.25;

/** Age multiplier in Mifflin-St Jeor equation (kcal per year) */
export const MIFFLIN_AGE_COEFF = 5;

/** Sex-specific constant for males in Mifflin-St Jeor */
export const MIFFLIN_MALE_CONSTANT = 5;

/** Sex-specific constant for females in Mifflin-St Jeor */
export const MIFFLIN_FEMALE_CONSTANT = -161;

// ── Caloric Density per Macronutrient Gram ──────────────────

export const CALORIES_PER_GRAM_PROTEIN = 4;
export const CALORIES_PER_GRAM_CARBS = 4;
export const CALORIES_PER_GRAM_FAT = 9;

// ── Activity Level Multipliers (TDEE = BMR * multiplier) ────

export const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  SEDENTARY: 1.2,
  LIGHTLY_ACTIVE: 1.375,
  MODERATELY_ACTIVE: 1.55,
  VERY_ACTIVE: 1.725,
  EXTREMELY_ACTIVE: 1.9,
} as const;

// ── Goal-Based Calorie Adjustments (kcal delta from TDEE) ───

export const GOAL_CALORIE_ADJUSTMENTS: Record<string, number> = {
  LOSE_WEIGHT: -500,
  GAIN_MUSCLE: 300,
  INCREASE_STRENGTH: 250,
  IMPROVE_ENDURANCE: 200,
  MAINTAIN: 0,
  CUSTOM: 0,
} as const;

// ── Safety Limits ───────────────────────────────────────────

/** Absolute minimum safe daily calorie intake */
export const MIN_SAFE_DAILY_CALORIES = 1200;

/** Absolute maximum reasonable daily calorie intake */
export const MAX_SAFE_DAILY_CALORIES = 6000;

// ── Input Validation Bounds ─────────────────────────────────

export const MIN_AGE = 13;
export const MAX_AGE = 100;
export const MIN_HEIGHT_CM = 100;
export const MAX_HEIGHT_CM = 250;
export const MIN_WEIGHT_KG = 30;
export const MAX_WEIGHT_KG = 300;

// ── Macro Split Percentages by Diet Type ────────────────────

export const MACRO_SPLITS: Record<
  string,
  { proteinPct: number; carbsPct: number; fatPct: number }
> = {
  BULKING: { proteinPct: 0.25, carbsPct: 0.5, fatPct: 0.25 },
  CUTTING: { proteinPct: 0.4, carbsPct: 0.3, fatPct: 0.3 },
  MAINTENANCE: { proteinPct: 0.3, carbsPct: 0.4, fatPct: 0.3 },
  RECOMPOSITION: { proteinPct: 0.35, carbsPct: 0.35, fatPct: 0.3 },
} as const;

// ── Goal to Diet Type Mapping ───────────────────────────────

export const GOAL_TO_DIET_TYPE: Record<string, string> = {
  LOSE_WEIGHT: 'CUTTING',
  GAIN_MUSCLE: 'BULKING',
  INCREASE_STRENGTH: 'BULKING',
  IMPROVE_ENDURANCE: 'MAINTENANCE',
  MAINTAIN: 'MAINTENANCE',
  CUSTOM: 'MAINTENANCE',
} as const;

// ── Meal Distribution (percentage of daily calories per meal) ─

export const MEAL_DISTRIBUTION = {
  FOUR_MEALS: [
    { name: 'Breakfast', pct: 0.25 },
    { name: 'Lunch', pct: 0.35 },
    { name: 'Snack', pct: 0.1 },
    { name: 'Dinner', pct: 0.3 },
  ],
  FIVE_MEALS: [
    { name: 'Breakfast', pct: 0.2 },
    { name: 'Mid-Morning Snack', pct: 0.1 },
    { name: 'Lunch', pct: 0.3 },
    { name: 'Evening Snack', pct: 0.1 },
    { name: 'Dinner', pct: 0.3 },
  ],
} as const;
