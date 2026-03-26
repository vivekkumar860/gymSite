export type { Habit, HabitLog, HabitWithStreak } from "@/api/schemas/habits.schema";

export type CreateHabitFormValues = {
  name: string;
  description?: string;
  frequency: "DAILY" | "WEEKLY";
  targetCount: number;
  color?: string;
  icon?: string;
};
