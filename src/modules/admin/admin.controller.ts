import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ChangePlanDto } from '../subscriptions/dto/change-plan.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('dashboard')
    getDashboardStats() {
        return this.adminService.getDashboardStats();
    }

    @Get('users')
    listUsers() {
        return this.adminService.listUsers();
    }

    @Get('users/:id')
    getUser(@Param('id') id: string) {
        return this.adminService.getUser(id);
    }

    @Patch('users/:id/role')
    updateUserRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
        return this.adminService.updateUserRole(id, dto.role);
    }

    @Delete('users/:id')
    deactivateUser(@Param('id') id: string) {
        return this.adminService.deactivateUser(id);
    }

    @Get('subscriptions')
    listSubscriptions() {
        return this.adminService.listSubscriptions();
    }

    @Patch('subscriptions/:userId/plan')
    changeUserPlan(@Param('userId') userId: string, @Body() dto: ChangePlanDto) {
        return this.adminService.changeUserPlan(userId, dto.plan);
    }

    @Get('analytics')
    getUsageAnalytics() {
        return this.adminService.getUsageAnalytics();
    }

    @Get('logs')
    getRequestLogs(@Query('page') page?: string, @Query('limit') limit?: string) {
        return this.adminService.getRequestLogs(
            page === undefined ? 1 : Number.parseInt(page, 10),
            limit === undefined ? 20 : Number.parseInt(limit, 10),
        );
    }

    @Get('health')
    getSystemHealth() {
        return this.adminService.getSystemHealth();
    }
}