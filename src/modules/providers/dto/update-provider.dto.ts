import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProviderDto {
    @ApiPropertyOptional({ example: 'OpenAI Primary', minLength: 1 })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @ApiPropertyOptional({ example: 'sk-example-api-key', minLength: 1, writeOnly: true })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    apiKey?: string;

    @ApiPropertyOptional({ example: 'gpt-4o-mini', minLength: 1 })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    defaultModel?: string;
}
