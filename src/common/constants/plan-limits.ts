import { PlanName } from '../../generated/prisma/enums';

export const PLAN_LIMITS: Record<PlanName, number> = {
    [PlanName.FREE]: 20,
    [PlanName.PREMIUM]: 1000,
};