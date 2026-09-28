import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProviderDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    apiKey?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    defaultModel?: string;
}
