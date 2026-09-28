import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { RequestUser } from '../../modules/auth/interfaces/request-user.interface';

type AuthenticatedRequest = Request & { user?: RequestUser };

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext): RequestUser => {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        if (!request.user) throw new UnauthorizedException();
        return request.user;
    },
);