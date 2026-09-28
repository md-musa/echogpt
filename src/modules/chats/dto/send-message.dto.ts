import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
    @IsOptional()
    @IsUUID()
    conversationId?: string;

    @IsUUID()
    providerId!: string;

    @IsString()
    @IsNotEmpty()
    content!: string;
}