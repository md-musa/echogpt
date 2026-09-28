import { IsBoolean } from 'class-validator';

export class ToggleStatusDto {
    @IsBoolean()
    isEnabled!: boolean;
}