import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestUser } from '../auth/interfaces/request-user.interface';
import { ChangePlanDto } from './dto/change-plan.dto';
import { SubscriptionsService } from './subscriptions.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Subscriptions')
@ApiBearerAuth('access-token')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) { }

  @ApiOperation({ summary: 'Get the current subscription status' })
  @ApiResponse({ status: 200, description: 'Subscription status returned successfully.' })
  @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
  @ApiResponse({ status: 404, description: 'Subscription was not found.' })
  @Get('status')
  @UseGuards(JwtAuthGuard)
  getStatus(@CurrentUser() user: RequestUser) {
    return this.subscriptionsService.getStatus(user.sub);
  }

  @ApiOperation({ summary: 'Change the current subscription plan' })
  @ApiResponse({ status: 200, description: 'Subscription plan changed successfully.' })
  @ApiResponse({ status: 400, description: 'The requested plan is invalid.' })
  @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
  @ApiResponse({ status: 404, description: 'Subscription was not found.' })
  @Patch('plan')
  @UseGuards(JwtAuthGuard)
  changePlan(@CurrentUser() user: RequestUser, @Body() dto: ChangePlanDto) {
    return this.subscriptionsService.changePlan(user.sub, dto.plan);
  }

  @ApiOperation({ summary: 'Get current subscription usage' })
  @ApiResponse({ status: 200, description: 'Subscription usage returned successfully.' })
  @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
  @ApiResponse({ status: 404, description: 'Subscription was not found.' })
  @Get('usage')
  @UseGuards(JwtAuthGuard)
  getUsage(@CurrentUser() user: RequestUser) {
    return this.subscriptionsService.getUsage(user.sub);
  }
}
