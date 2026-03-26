import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { queryKeys } from "@/config/query-keys";
import * as nutritionService from "@/api/services/nutrition.service";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useFoodSearch(query: string) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: [...queryKeys.nutrition.all, "search", debouncedQuery],
    queryFn: () => nutritionService.searchFoods(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });
}
