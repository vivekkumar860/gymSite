export function formatDietType(raw: string): string {
  const map: Record<string, string> = {
    BULKING: "Bulking",
    CUTTING: "Cutting",
    MAINTENANCE: "Maintenance",
    RECOMPOSITION: "Recomposition",
  };
  return map[raw] ?? raw;
}

export function formatMealPlanType(raw: string): string {
  const map: Record<string, string> = {
    INDIAN_VEGETARIAN: "Indian Vegetarian",
    INDIAN_NON_VEG: "Indian Non-Veg",
    VEGAN: "Vegan",
    HOSTEL_BUDGET: "Hostel Budget",
    OFFICE_GOING: "Office Going",
  };
  return map[raw] ?? raw;
}

export function formatActivityLevel(raw: string): string {
  const map: Record<string, string> = {
    SEDENTARY: "Sedentary",
    LIGHTLY_ACTIVE: "Lightly Active",
    MODERATELY_ACTIVE: "Moderately Active",
    VERY_ACTIVE: "Very Active",
    EXTREMELY_ACTIVE: "Extremely Active",
  };
  return map[raw] ?? raw;
}

export function formatGoalType(raw: string): string {
  const map: Record<string, string> = {
    LOSE_WEIGHT: "Lose Weight",
    GAIN_MUSCLE: "Gain Muscle",
    INCREASE_STRENGTH: "Increase Strength",
    IMPROVE_ENDURANCE: "Improve Endurance",
    MAINTAIN: "Maintain",
    CUSTOM: "Custom",
  };
  return map[raw] ?? raw;
}

export function formatBudgetPreference(raw: string): string {
  const map: Record<string, string> = {
    LOW: "Low Budget",
    MEDIUM: "Medium Budget",
    HIGH: "High Budget",
  };
  return map[raw] ?? raw;
}
