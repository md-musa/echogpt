import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProviderType } from '../../../generated/prisma/enums';

export class CreateProviderDto {
    @IsEnum(ProviderType)
    type!: ProviderType;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    apiKey!: string;

    @IsString()
    @IsNotEmpty()
    defaultModel!: string;
}
