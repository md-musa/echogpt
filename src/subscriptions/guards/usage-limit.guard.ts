import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { RequestUser } from '../../auth/interfaces/request-user.interface';
import { PLAN_LIMITS } from '../../common/constants/plan-limits';

type AuthenticatedRequest = Request & { user?: RequestUser };

@Injectable()
export class UsageLimitGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const userId = request.user?.sub;
        if (!userId) throw new ForbiddenException('Daily request limit reached');

        const subscription = await this.prisma.subscription.findUniqueOrThrow({
            where: { userId },
            select: {
                plan: true,
                requestsUsedToday: true,
                usageResetAt: true,
            },
        });

        const now = new Date();
        if (subscription.usageResetAt.toDateString() !== now.toDateString()) {
            await this.prisma.subscription.update({
                where: { userId },
                data: { requestsUsedToday: 0, usageResetAt: now },
            });
        }

        const result = await this.prisma.subscription.updateMany({
            where: {
                userId,
                requestsUsedToday: { lt: PLAN_LIMITS[subscription.plan] },
            },
            data: { requestsUsedToday: { increment: 1 } },
        });

        if (result.count !== 1) {
            throw new ForbiddenException('Daily request limit reached');
        }

        return true;
    }
}