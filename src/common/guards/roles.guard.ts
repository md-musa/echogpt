import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { RequestUser } from '../../auth/interfaces/request-user.interface';
import { ROLES_KEY } from '../decorators/roles.decorator';

type AuthenticatedRequest = Request & { user?: RequestUser };

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!roles?.length) return true;

        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        if (!request.user || !roles.includes(request.user.role)) {
            throw new ForbiddenException('Insufficient role');
        }
        return true;
    }
}