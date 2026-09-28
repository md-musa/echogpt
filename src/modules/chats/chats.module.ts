import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PrismaModule } from '../../prisma/prisma.module';
import { ProvidersModule } from '../providers/providers.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';

@Module({
  imports: [JwtModule.register({}), PrismaModule, ProvidersModule, SubscriptionsModule],
  controllers: [ChatsController],
  providers: [ChatsService, JwtAuthGuard],
})
export class ChatsModule { }
