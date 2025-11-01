/**
 * Base service class
 * Provides common service methods
 * All services should extend this class
 */
export abstract class BaseService {
  /**
   * Log service operations (can be overridden)
   */
  protected log(operation: string, details?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Service] ${operation}`, details || '');
    }
  }
}

