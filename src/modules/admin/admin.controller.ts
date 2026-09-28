import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ChangePlanDto } from '../subscriptions/dto/change-plan.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiTags('Admin')
@ApiBearerAuth('access-token')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('dashboard')
    @ApiOperation({ summary: 'Get dashboard statistics' })
    @ApiResponse({ status: 200, description: 'Dashboard statistics returned successfully.' })
    @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
    @ApiResponse({ status: 403, description: 'Administrator role is required.' })
    getDashboardStats() {
        return this.adminService.getDashboardStats();
    }

    @Get('users')
    @ApiOperation({ summary: 'List users' })
    @ApiResponse({ status: 200, description: 'Users returned successfully.' })
    @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
    @ApiResponse({ status: 403, description: 'Administrator role is required.' })
    listUsers() {
        return this.adminService.listUsers();
    }

    @Get('users/:id')
    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiResponse({ status: 200, description: 'User returned successfully.' })
    @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
    @ApiResponse({ status: 403, description: 'Administrator role is required.' })
    @ApiResponse({ status: 404, description: 'User was not found.' })
    getUser(@Param('id') id: string) {
        return this.adminService.getUser(id);
    }

    @Patch('users/:id/role')
    @ApiOperation({ summary: 'Update a user role' })
    @ApiResponse({ status: 200, description: 'User role updated successfully.' })
    @ApiResponse({ status: 400, description: 'Role value is invalid.' })
    @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
    @ApiResponse({ status: 403, description: 'Administrator role is required.' })
    @ApiResponse({ status: 404, description: 'User was not found.' })
    updateUserRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
        return this.adminService.updateUserRole(id, dto.role);
    }

    @Delete('users/:id')
    @ApiOperation({ summary: 'Deactivate a user account' })
    @ApiResponse({ status: 200, description: 'User account deactivated successfully.' })
    @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
    @ApiResponse({ status: 403, description: 'Administrator role is required.' })
    @ApiResponse({ status: 404, description: 'User was not found.' })
    deactivateUser(@Param('id') id: string) {
        return this.adminService.deactivateUser(id);
    }

    @Get('subscriptions')
    @ApiOperation({ summary: 'List subscriptions' })
    @ApiResponse({ status: 200, description: 'Subscriptions returned successfully.' })
    @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
    @ApiResponse({ status: 403, description: 'Administrator role is required.' })
    listSubscriptions() {
        return this.adminService.listSubscriptions();
    }

    @Patch('subscriptions/:userId/plan')
    @ApiOperation({ summary: 'Change a user subscription plan' })
    @ApiResponse({ status: 200, description: 'Subscription plan changed successfully.' })
    @ApiResponse({ status: 400, description: 'Plan value is invalid.' })
    @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
    @ApiResponse({ status: 403, description: 'Administrator role is required.' })
    @ApiResponse({ status: 404, description: 'Subscription was not found.' })
    changeUserPlan(@Param('userId') userId: string, @Body() dto: ChangePlanDto) {
        return this.adminService.changeUserPlan(userId, dto.plan);
    }

    @Get('analytics')
    @ApiOperation({ summary: 'Get usage analytics' })
    @ApiResponse({ status: 200, description: 'Usage analytics returned successfully.' })
    @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
    @ApiResponse({ status: 403, description: 'Administrator role is required.' })
    getUsageAnalytics() {
        return this.adminService.getUsageAnalytics();
    }

    @Get('logs')
    @ApiOperation({ summary: 'List request logs' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
    @ApiResponse({ status: 200, description: 'Request logs returned successfully.' })
    @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
    @ApiResponse({ status: 403, description: 'Administrator role is required.' })
    getRequestLogs(@Query('page') page?: string, @Query('limit') limit?: string) {
        return this.adminService.getRequestLogs(
            page === undefined ? 1 : Number.parseInt(page, 10),
            limit === undefined ? 20 : Number.parseInt(limit, 10),
        );
    }

    @Get('health')
    @ApiOperation({ summary: 'Get system health status' })
    @ApiResponse({ status: 200, description: 'System health status returned.' })
    @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
    @ApiResponse({ status: 403, description: 'Administrator role is required.' })
    getSystemHealth() {
        return this.adminService.getSystemHealth();
    }
}