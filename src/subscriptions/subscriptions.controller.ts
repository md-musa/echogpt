import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { RequestUser } from '../auth/interfaces/request-user.interface';
import { ChangePlanDto } from './dto/change-plan.dto';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) { }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  getStatus(@CurrentUser() user: RequestUser) {
    return this.subscriptionsService.getStatus(user.sub);
  }

  @Patch('plan')
  @UseGuards(JwtAuthGuard)
  changePlan(@CurrentUser() user: RequestUser, @Body() dto: ChangePlanDto) {
    return this.subscriptionsService.changePlan(user.sub, dto.plan);
  }

  @Get('usage')
  @UseGuards(JwtAuthGuard)
  getUsage(@CurrentUser() user: RequestUser) {
    return this.subscriptionsService.getUsage(user.sub);
  }
}
