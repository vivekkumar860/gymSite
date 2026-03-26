import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as habitsService from "@/api/services/habits.service";

type CreateHabitData = {
  habitName: string;
  frequency: string;
  targetValue?: number;
  unitLabel?: string;
  colorHex?: string;
};

export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHabitData) =>
      habitsService.createHabit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits.all });
    },
  });
}
