import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestUser } from '../auth/interfaces/request-user.interface';
import { UsageLimitGuard } from '../subscriptions/guards/usage-limit.guard';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatsService } from './chats.service';

@Controller('chat')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) { }

  @Post('send')
  @UseGuards(JwtAuthGuard, UsageLimitGuard)
  sendMessage(@CurrentUser() user: RequestUser, @Body() dto: SendMessageDto) {
    return this.chatsService.sendMessage(user.sub, dto);
  }

  @Get('conversations')
  @UseGuards(JwtAuthGuard)
  getConversations(@CurrentUser() user: RequestUser) {
    return this.chatsService.getConversations(user.sub);
  }

  @Get('conversations/:id')
  @UseGuards(JwtAuthGuard)
  getConversation(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.chatsService.getConversation(user.sub, id);
  }
}
