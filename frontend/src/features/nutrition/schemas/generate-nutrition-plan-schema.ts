import { z } from "zod";

const GENDER_VALUES = ["MALE", "FEMALE"] as const;

const ACTIVITY_LEVEL_VALUES = [
  "SEDENTARY",
  "LIGHTLY_ACTIVE",
  "MODERATELY_ACTIVE",
  "VERY_ACTIVE",
  "EXTREMELY_ACTIVE",
] as const;

const GOAL_VALUES = [
  "LOSE_WEIGHT",
  "GAIN_MUSCLE",
  "INCREASE_STRENGTH",
  "IMPROVE_ENDURANCE",
  "MAINTAIN",
  "CUSTOM",
] as const;

const DIET_PREFERENCE_VALUES = [
  "INDIAN_VEGETARIAN",
  "INDIAN_NON_VEG",
  "VEGAN",
  "HOSTEL_BUDGET",
  "OFFICE_GOING",
] as const;

const BUDGET_PREFERENCE_VALUES = ["LOW", "MEDIUM", "HIGH"] as const;

export const generateNutritionPlanSchema = z.object({
  age: z.number().int().min(13, "Age must be at least 13").max(100, "Age must be at most 100"),
  gender: z.enum(GENDER_VALUES, { message: "Select your gender" }),
  heightCm: z.number().min(100, "Height must be at least 100 cm").max(250, "Height must be at most 250 cm"),
  weightKg: z.number().min(30, "Weight must be at least 30 kg").max(300, "Weight must be at most 300 kg"),
  activityLevel: z.enum(ACTIVITY_LEVEL_VALUES, { message: "Select your activity level" }),
  goal: z.enum(GOAL_VALUES, { message: "Select your goal" }),
  dietPreference: z.enum(DIET_PREFERENCE_VALUES, { message: "Select your diet preference" }),
  budgetPreference: z.enum(BUDGET_PREFERENCE_VALUES, { message: "Select your budget preference" }),
});

export type GenerateNutritionPlanFormValues = z.infer<typeof generateNutritionPlanSchema>;

export {
  GENDER_VALUES,
  ACTIVITY_LEVEL_VALUES,
  GOAL_VALUES,
  DIET_PREFERENCE_VALUES,
  BUDGET_PREFERENCE_VALUES,
};
