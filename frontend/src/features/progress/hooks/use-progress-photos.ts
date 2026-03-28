import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import * as progressService from "@/api/services/progress.service";

export function useProgressPhotos() {
  const { data, isLoading, error } = useQuery({
    queryKey: [...queryKeys.progress.all, "photos"],
    queryFn: () => progressService.getProgressPhotos(),
  });

  return { photos: data, isLoading, error };
}
