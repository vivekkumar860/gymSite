import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as habitsService from "@/api/services/habits.service";

export function useHabits() {
  return useQuery({
    queryKey: queryKeys.habits.all,
    queryFn: habitsService.getHabits,
  });
}
