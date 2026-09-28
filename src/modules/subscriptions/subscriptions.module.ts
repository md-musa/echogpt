import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { UsageLimitGuard } from './guards/usage-limit.guard';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, JwtAuthGuard, UsageLimitGuard],
  exports: [UsageLimitGuard],
})
export class SubscriptionsModule { }
