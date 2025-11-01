/**
 * Generic API Response type
 * Used for consistent API responses across the application
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

/**
 * Paginated response type
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * List response type
 */
export interface ListResponse<T> {
  success: boolean;
  data: T[];
}

/**
 * Single item response type
 */
export interface ItemResponse<T> {
  success: boolean;
  data: T;
}

