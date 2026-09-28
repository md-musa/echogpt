import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestUser } from '../auth/interfaces/request-user.interface';
import { UsageLimitGuard } from '../subscriptions/guards/usage-limit.guard';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatsService } from './chats.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Chats')
@ApiBearerAuth('access-token')
@Controller('chat')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) { }

  @Post('send')
  @UseGuards(JwtAuthGuard, UsageLimitGuard)
  @ApiOperation({ summary: 'Send a chat message' })
  @ApiResponse({ status: 201, description: 'Message sent and response returned.' })
  @ApiResponse({ status: 400, description: 'Message request is invalid.' })
  @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
  @ApiResponse({ status: 403, description: 'Provider is disabled or daily usage limit was reached.' })
  @ApiResponse({ status: 404, description: 'Provider or conversation was not found.' })
  sendMessage(@CurrentUser() user: RequestUser, @Body() dto: SendMessageDto) {
    return this.chatsService.sendMessage(user.sub, dto);
  }

  @Get('conversations')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List the current user conversations' })
  @ApiResponse({ status: 200, description: 'Conversations returned successfully.' })
  @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
  getConversations(@CurrentUser() user: RequestUser) {
    return this.chatsService.getConversations(user.sub);
  }

  @Get('conversations/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a conversation and its messages' })
  @ApiResponse({ status: 200, description: 'Conversation returned successfully.' })
  @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
  @ApiResponse({ status: 403, description: 'Conversation belongs to another user.' })
  @ApiResponse({ status: 404, description: 'Conversation was not found.' })
  getConversation(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.chatsService.getConversation(user.sub, id);
  }
}
