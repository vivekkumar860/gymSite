import { z } from "zod";

export const fitnessGoals = [
  "lose_weight",
  "build_muscle",
  "maintain",
  "improve_endurance",
] as const;

export const goalSelectionSchema = z.object({
  fitnessGoal: z.enum(fitnessGoals, {
    message: "Please select a fitness goal",
  }),
});

export type GoalSelectionData = z.infer<typeof goalSelectionSchema>;
