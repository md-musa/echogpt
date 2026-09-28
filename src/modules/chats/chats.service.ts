import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { MessageRole } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { ProvidersService } from '../providers/providers.service';
import { ProviderAdapterFactory } from '../providers/adapters/provider-adapter.factory';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly providersService: ProvidersService,
        private readonly providerAdapterFactory: ProviderAdapterFactory,
    ) { }

    async sendMessage(userId: string, dto: SendMessageDto) {
        console.log('Sending message:', { userId, dto });
        const provider = await this.providersService.findForChat(dto.providerId);
        if (!provider) throw new NotFoundException('Provider not found');
        if (!provider.isEnabled) throw new ForbiddenException('Provider is disabled');

        let conversation;
        if (dto.conversationId) {
            conversation = await this.prisma.conversation.findUnique({
                where: { id: dto.conversationId },
            });
            if (!conversation) throw new NotFoundException('Conversation not found');
            if (conversation.userId !== userId) {
                throw new ForbiddenException('You do not have access to this conversation');
            }
        } else {
            conversation = await this.prisma.conversation.create({
                data: { userId, providerId: dto.providerId },
            });
        }

        await this.prisma.message.create({
            data: {
                conversationId: conversation.id,
                role: MessageRole.USER,
                content: dto.content,
            },
        });

        const history = await this.prisma.message.findMany({
            where: { conversationId: conversation.id },
            orderBy: { createdAt: 'asc' },
        });
        const apiKey = await this.providersService.getDecryptedKey(dto.providerId);
        const reply = await this.providerAdapterFactory.getAdapter(provider.type).chat(
            apiKey,
            provider.defaultModel,
            history.map((message) => ({
                role: message.role === MessageRole.USER ? 'user' : 'assistant',
                content: message.content,
            })),
        );

        await this.prisma.message.create({
            data: {
                conversationId: conversation.id,
                role: MessageRole.ASSISTANT,
                content: reply,
            },
        });

        return { conversationId: conversation.id, message: reply };
    }

    getConversations(userId: string) {
        return this.prisma.conversation.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getConversation(userId: string, conversationId: string) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { messages: { orderBy: { createdAt: 'asc' } } },
        });
        if (!conversation) throw new NotFoundException('Conversation not found');
        if (conversation.userId !== userId) {
            throw new ForbiddenException('You do not have access to this conversation');
        }
        return conversation;
    }
}
