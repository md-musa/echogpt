import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'Mohammad Musa', minLength: 1, maxLength: 100 })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name?: string;
}
