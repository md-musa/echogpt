import { IsEnum } from 'class-validator';
import { PlanName } from '../../../generated/prisma/enums';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePlanDto {
    @ApiProperty({ enum: PlanName, example: PlanName.PREMIUM })
    @IsEnum(PlanName)
    plan!: PlanName;
}