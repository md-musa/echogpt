import { IsEnum } from 'class-validator';
import { RoleName } from '../../generated/prisma/enums';

export class UpdateUserRoleDto {
    @IsEnum(RoleName)
    role!: RoleName;
}