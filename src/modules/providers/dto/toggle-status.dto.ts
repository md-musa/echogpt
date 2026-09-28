import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleStatusDto {
    @ApiProperty({ example: true })
    @IsBoolean()
    isEnabled!: boolean;
}