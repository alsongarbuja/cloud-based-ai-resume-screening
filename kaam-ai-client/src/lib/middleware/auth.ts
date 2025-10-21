

import { NextRequest, NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { auth } from '@/lib/auth/config';
import { UnauthorizedError, ForbiddenError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { HTTP_STATUS } from '@/config/constants';

export type AuthenticatedHandler<T = unknown> = (
  request: NextRequest,
  session: Session,
  context?: T
) => Promise<NextResponse> | NextResponse;

export type CompanyHandler<T = unknown> = (
  request: NextRequest,
  session: Session & { user: { companyId: string; userType: 'COMPANY' } },
  context?: T
) => Promise<NextResponse> | NextResponse;

export function withAuth<T = unknown>(
  handler: AuthenticatedHandler<T>
): (req: NextRequest, context?: T) => Promise<NextResponse> {
  return async (req: NextRequest, context?: T) => {
    try {
      const session = await auth();

      if (!session?.user?.id) {
        logger.warn('Unauthorized access attempt', {
          context: { path: req.nextUrl.pathname },
        });
        throw new UnauthorizedError('Authentication required');
      }

      return await handler(req, session, context);
    } catch (error) {
      return handleError(error);
    }
  };
}

export function withCompanyAuth<T = unknown>(
  handler: CompanyHandler<T>
): (req: NextRequest, context?: T) => Promise<NextResponse> {
  return async (req: NextRequest, context?: T) => {
    try {
      const session = await auth();

      if (!session?.user?.id) {
        throw new UnauthorizedError('Authentication required');
      }

      if (session.user.userType !== 'COMPANY') {
        logger.warn('Non-company user attempted company action', {
          context: {
            userId: session.user.id,
            userType: session.user.userType,
            path: req.nextUrl.pathname,
          },
        });
        throw new ForbiddenError('Only company users can perform this action');
      }

      if (!session.user.companyId) {
        throw new ForbiddenError('Company profile not found');
      }

      return await handler(req, session as CompanyHandler<T> extends (req: NextRequest, session: infer S, context?: T) => unknown ? S : never, context);
    } catch (error) {
      return handleError(error);
    }
  };
}


export function handleError(error: unknown): NextResponse {
  if (error instanceof UnauthorizedError) {
    return NextResponse.json(
      { error: error.message },
      { status: HTTP_STATUS.UNAUTHORIZED }
    );
  }

  if (error instanceof ForbiddenError) {
    return NextResponse.json(
      { error: error.message },
      { status: HTTP_STATUS.FORBIDDEN }
    );
  }

  logger.error('API route error', {
    error: error instanceof Error ? error : new Error(String(error)),
  });

  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
  );
}
