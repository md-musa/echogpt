import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendMessageDto {
    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', format: 'uuid' })
    @IsOptional()
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', format: 'uuid' })
    @IsUUID()
    conversationId?: string;

    @IsUUID()
    providerId!: string;

    @ApiProperty({ example: 'Can you summarize this topic?', minLength: 1 })
    @IsString()
    @IsNotEmpty()
    content!: string;
}