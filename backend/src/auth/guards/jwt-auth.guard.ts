import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): Request {
    const request: Request = context.switchToHttp().getRequest();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const token = request.cookies['auth-token'];

    if (token) {
      request.headers.authorization = `Bearer ${token}`;
    }
    return request;
  }
}
