import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteAccountDto {
    @ApiProperty({ example: 'currentPass123', minLength: 1 })
    @IsString()
    @MinLength(1)
    currentPassword!: string;
}