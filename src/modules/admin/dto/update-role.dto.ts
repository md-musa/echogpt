import { IsEnum } from 'class-validator';
import { RoleName } from '../../../generated/prisma/enums';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
    @ApiProperty({ enum: RoleName, example: RoleName.USER })
    @IsEnum(RoleName)
    role!: RoleName;
}