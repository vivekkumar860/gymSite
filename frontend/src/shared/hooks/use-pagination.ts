"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DEFAULT_PAGE_SIZE } from "@/config/constants";

export function usePagination() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || DEFAULT_PAGE_SIZE;

  const setParam = useCallback(
    (key: string, value: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, String(value));
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const setPage = useCallback(
    (newPage: number) => {
      setParam("page", newPage);
    },
    [setParam],
  );

  const setLimit = useCallback(
    (newLimit: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("limit", String(newLimit));
      params.set("page", "1");
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const offset = useMemo(() => (page - 1) * limit, [page, limit]);

  return { page, limit, setPage, setLimit, offset };
}
