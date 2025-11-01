import { NextResponse } from 'next/server';
import { ApiError } from './api-error';

/**
 * Centralized error handler for API routes
 * Converts errors to proper HTTP responses
 */
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  // Handle known ApiError instances
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        details: error.details,
        success: false,
      },
      { status: error.statusCode }
    );
  }

  // Handle Zod validation errors
  if (error && typeof error === 'object' && 'issues' in error) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: error,
        success: false,
      },
      { status: 400 }
    );
  }

  // Handle unknown errors
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
  const errorDetails = error instanceof Error ? {
    name: error.name,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  } : undefined;

  return NextResponse.json(
    {
      error: errorMessage,
      details: errorDetails,
      success: false,
    },
    { status: 500 }
  );
}

/**
 * Helper to create success response
 */
export function successResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Helper to create error response
 */
export function errorResponse(
  message: string,
  statusCode: number,
  details?: unknown
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details,
    },
    { status: statusCode }
  );
}

