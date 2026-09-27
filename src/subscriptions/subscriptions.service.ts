import { Injectable } from '@nestjs/common';
import { PlanName, SubscriptionStatus } from '../generated/prisma/enums';
import { PLAN_LIMITS } from '../common/constants/plan-limits';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) { }

  async getStatus(userId: string) {
    console.log('Getting subscription status for user:', userId);
    return this.prisma.subscription.findUniqueOrThrow({
      where: { userId },
      select: {
        plan: true,
        status: true,
        startedAt: true,
        endsAt: true,
      },
    });
  }

  async changePlan(userId: string, plan: PlanName) {
    return this.prisma.subscription.update({
      where: { userId },
      data: {
        plan,
        status: SubscriptionStatus.ACTIVE,
        startedAt: new Date(),
        ...(plan === PlanName.PREMIUM ? { endsAt: null } : {}),
      },
      select: {
        plan: true,
        status: true,
        startedAt: true,
        endsAt: true,
      },
    });
  }

  async getUsage(userId: string) {
    const subscription = await this.prisma.subscription.findUniqueOrThrow({
      where: { userId },
      select: {
        plan: true,
        requestsUsedToday: true,
        usageResetAt: true,
      },
    });

    const now = new Date();
    let used = subscription.requestsUsedToday;
    let resetsAt = subscription.usageResetAt;

    if (resetsAt.toDateString() !== now.toDateString()) {
      await this.prisma.subscription.update({
        where: { userId },
        data: { requestsUsedToday: 0, usageResetAt: now },
      });
      used = 0;
      resetsAt = now;
    }

    const limit = PLAN_LIMITS[subscription.plan];
    return {
      plan: subscription.plan,
      limit,
      used,
      remaining: Math.max(limit - used, 0),
      resetsAt,
    };
  }
}
