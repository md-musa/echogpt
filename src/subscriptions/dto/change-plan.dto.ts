import { IsEnum } from 'class-validator';
import { PlanName } from '../../generated/prisma/enums';

export class ChangePlanDto {
    @IsEnum(PlanName)
    plan!: PlanName;
}