import { IsEnum } from 'class-validator';
import { RoleName } from '../../generated/prisma/enums';

export class UpdateRoleDto {
    @IsEnum(RoleName)
    role!: RoleName;
}