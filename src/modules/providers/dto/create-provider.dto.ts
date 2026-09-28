import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProviderType } from '../../../generated/prisma/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProviderDto {
    @ApiProperty({ enum: ProviderType, example: ProviderType.OPENAI })
    @IsEnum(ProviderType)
    type!: ProviderType;

    @ApiProperty({ example: 'OpenAI Primary', minLength: 1 })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: 'sk-example-api-key', minLength: 1, writeOnly: true })
    @IsString()
    @IsNotEmpty()
    apiKey!: string;

    @ApiProperty({ example: 'gpt-4o-mini', minLength: 1 })
    @IsString()
    @IsNotEmpty()
    defaultModel!: string;
}
