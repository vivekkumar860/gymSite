import type React from "react";

// ---------------------------------------------------------------------------
// Pagination & sorting
// ---------------------------------------------------------------------------

export type PaginationParams = {
  page: number;
  limit: number;
};

export type SortParams = {
  sortBy: string;
  sortOrder: "asc" | "desc";
};

// ---------------------------------------------------------------------------
// Date range
// ---------------------------------------------------------------------------

export type DateRange = {
  from: Date;
  to: Date;
};

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------

export type LoadingState = "idle" | "loading" | "success" | "error";

// ---------------------------------------------------------------------------
// Component helpers
// ---------------------------------------------------------------------------

export type PropsWithClassName = {
  className?: string;
};

export type EmptyStateProps = {
  icon?: React.ComponentType;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};
