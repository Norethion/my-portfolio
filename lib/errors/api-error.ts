/**
 * Base API Error class
 * All API errors should extend this class
 */
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    
    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Validation error - for invalid input data (400)
 */
export class ValidationError extends ApiError {
  constructor(message: string, public readonly validationErrors?: unknown) {
    super(400, message, validationErrors);
    this.name = 'ValidationError';
  }
}

/**
 * Not found error - for missing resources (404)
 */
export class NotFoundError extends ApiError {
  constructor(resource: string, id?: string | number) {
    const message = id 
      ? `${resource} with id ${id} not found`
      : `${resource} not found`;
    super(404, message);
    this.name = 'NotFoundError';
  }
}

/**
 * Unauthorized error - for authentication failures (401)
 */
export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized access') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Forbidden error - for authorization failures (403)
 */
export class ForbiddenError extends ApiError {
  constructor(message = 'Access forbidden') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

/**
 * Internal server error - for unexpected errors (500)
 */
export class InternalServerError extends ApiError {
  constructor(message = 'Internal server error', details?: unknown) {
    super(500, message, details);
    this.name = 'InternalServerError';
  }
}

