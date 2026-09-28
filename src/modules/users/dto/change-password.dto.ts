import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
    @ApiProperty({ example: 'currentPass123', minLength: 1 })
    @IsString()
    @MinLength(1)
    currentPassword!: string;

    @ApiProperty({ example: 'newSecurePass123', minLength: 8, maxLength: 30 })
    @IsString()
    @MinLength(8)
    @MaxLength(30)
    newPassword!: string;
}