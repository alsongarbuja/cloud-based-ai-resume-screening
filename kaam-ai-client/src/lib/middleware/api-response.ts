
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { HTTP_STATUS } from '@/config/constants';
import { ValidationError, AppError, toAppError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export function successResponse<T>(
  data: T,
  status: number = HTTP_STATUS.OK
): NextResponse<{ success: true; data: T }> {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(
  message: string,
  status: number = HTTP_STATUS.BAD_REQUEST,
  details?: unknown
): NextResponse<{ success: false; error: string; details?: unknown }> {
  const response: { success: false; error: string; details?: unknown } = {
    success: false,
    error: message,
  };

  if (details) {
    response.details = details;
  }

  return NextResponse.json(response, { status });
}


export function handleZodError(error: z.ZodError): NextResponse {
  const firstError = error.issues[0];
  const message = firstError?.message || 'Validation failed';

  logger.warn('Validation error', {
    context: { issues: error.issues },
  });

  return errorResponse(message, HTTP_STATUS.BAD_REQUEST, error.issues);
}

export function handleAppError(error: AppError): NextResponse {
  logger.error('Application error', {
    error,
    context: {
      statusCode: error.statusCode,
      isOperational: error.isOperational,
    },
  });

  if (error instanceof ValidationError && error.errors) {
    return errorResponse(error.message, error.statusCode, error.errors);
  }

  return errorResponse(error.message, error.statusCode);
}


export function handleApiError(error: unknown): NextResponse {
  if (error instanceof z.ZodError) {
    return handleZodError(error);
  }

  if (error instanceof AppError) {
    return handleAppError(error);
  }

  const appError = toAppError(error);
  logger.error('Unexpected error in API route', {
    error: error instanceof Error ? error : new Error(String(error)),
  });

  return errorResponse(
    appError.message,
    appError.statusCode
  );
}


export function asyncHandler<T = unknown>(
  handler: (req: Request, context?: T) => Promise<NextResponse>
): (req: Request, context?: T) => Promise<NextResponse> {
  return async (req: Request, context?: T) => {
    try {
      return await handler(req, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
