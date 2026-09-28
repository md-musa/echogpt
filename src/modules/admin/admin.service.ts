import { Injectable, NotFoundException } from '@nestjs/common';
import { PlanName, RoleName, SubscriptionStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';

const safeUserSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
    isEmailVerified: true,
    deletedAt: true,
    createdAt: true,
} as const;

@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService) { }

    async getDashboardStats() {
        const [totalUsers, totalConversations, totalProviders, usersByPlan] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.conversation.count(),
            this.prisma.aiProvider.count(),
            this.prisma.subscription.groupBy({ by: ['plan'], _count: true }),
        ]);

        return { totalUsers, totalConversations, totalProviders, usersByPlan };
    }

    listUsers() {
        return this.prisma.user.findMany({
            select: safeUserSelect,
            orderBy: { createdAt: 'desc' },
        });
    }

    async getUser(id: string) {
        try {
            return await this.prisma.user.findUniqueOrThrow({
                where: { id },
                select: safeUserSelect,
            });
        } catch (error) {
            if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
                throw new NotFoundException('User not found');
            }
            throw error;
        }
    }

    updateUserRole(id: string, role: RoleName) {
        return this.prisma.user.update({
            where: { id },
            data: { role },
            select: safeUserSelect,
        });
    }

    deactivateUser(id: string) {
        return this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date(), refreshTokenHash: null },
            select: safeUserSelect,
        });
    }

    listSubscriptions() {
        return this.prisma.subscription.findMany({
            include: { user: { select: { id: true, email: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    changeUserPlan(userId: string, plan: PlanName) {
        return this.prisma.subscription.update({
            where: { userId },
            data: { plan, status: SubscriptionStatus.ACTIVE, startedAt: new Date() },
        });
    }

    async getUsageAnalytics() {
        const [totalRequests, requestsByEndpoint, topUsers] = await Promise.all([
            this.prisma.apiUsageLog.count(),
            this.prisma.apiUsageLog.groupBy({ by: ['endpoint'], _count: true }),
            this.prisma.apiUsageLog.groupBy({
                by: ['userId'],
                _count: true,
                orderBy: { _count: { userId: 'desc' } },
                take: 5,
            }),
        ]);

        return { totalRequests, requestsByEndpoint, topUsers };
    }

    async getRequestLogs(page = 1, limit = 20) {
        const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
        const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 20;
        const [logs, total] = await Promise.all([
            this.prisma.apiUsageLog.findMany({
                skip: (safePage - 1) * safeLimit,
                take: safeLimit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.apiUsageLog.count(),
        ]);

        return { logs, total, page: safePage, limit: safeLimit };
    }

    async getSystemHealth() {
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            return { status: 'ok', database: 'connected', uptime: process.uptime() };
        } catch {
            return { status: 'error', database: 'disconnected', uptime: process.uptime() };
        }
    }
}