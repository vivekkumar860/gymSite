export type { Goal } from "@/api/schemas/goals.schema";

export type CreateGoalFormValues = {
  type: "weight" | "strength" | "habit" | "body_measurement" | "custom";
  title: string;
  description?: string;
  targetValue: number;
  unit?: string;
  targetDate: string;
};
