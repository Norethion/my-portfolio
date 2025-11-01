/**
 * Base repository class
 * Provides common repository methods
 * All repositories should extend this class
 */
export abstract class BaseRepository {
  // Placeholder for common methods
  // Can be extended with logging, caching, etc.
  
  /**
   * Log repository operations (can be overridden)
   */
  protected log(operation: string, details?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Repository] ${operation}`, details || '');
    }
  }
}

