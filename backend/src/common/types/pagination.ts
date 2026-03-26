/** Query parameters for paginated list endpoints. */
export interface PaginationQuery {
  page: number;
  limit: number;
}

/** Standard paginated response wrapper. */
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

/** Default pagination values. */
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 100;
