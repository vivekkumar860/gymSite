import { apiClient } from "@/api/client";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Schemas matching backend GoalResponseDto
// ---------------------------------------------------------------------------

const goalResponseSchema = z.object({
  id: z.string(),
  goalType: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  targetValue: z.number().nullable(),
  targetUnit: z.string().nullable(),
  currentValue: z.number().nullable(),
  deadline: z.string().nullable(),
  goalStatus: z.string(),
  progressPct: z.number(),
  createdAt: z.string(),
});

export type GoalResponse = z.infer<typeof goalResponseSchema>;

const goalsListSchema = z.array(goalResponseSchema);

// ---------------------------------------------------------------------------
// Goals Service
// ---------------------------------------------------------------------------

export async function getGoals(): Promise<GoalResponse[]> {
  return apiClient.get("/goals", goalsListSchema);
}

export async function getActiveGoals(): Promise<GoalResponse[]> {
  const goals = await getGoals();
  return goals.filter((g) => g.goalStatus === "ACTIVE");
}

export async function getGoalById(id: string): Promise<GoalResponse> {
  return apiClient.get(`/goals/${id}`, goalResponseSchema);
}

export async function createGoal(data: {
  goalType: string;
  title: string;
  description?: string;
  targetValue?: number;
  targetUnit?: string;
  deadline?: string;
}): Promise<GoalResponse> {
  return apiClient.post("/goals", data, goalResponseSchema);
}

export async function updateGoal(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    targetValue: number;
    currentValue: number;
    goalStatus: string;
    deadline: string;
  }>,
): Promise<GoalResponse> {
  return apiClient.patch(`/goals/${id}`, data, goalResponseSchema);
}

export async function deleteGoal(id: string): Promise<void> {
  return apiClient.delete(`/goals/${id}`);
}
