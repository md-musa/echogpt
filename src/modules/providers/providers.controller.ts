import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProvidersService } from './providers.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ToggleStatusDto } from './dto/toggle-status.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Providers')
@ApiBearerAuth('access-token')
@Controller('providers')
export class ProvidersController {
  constructor(private readonly service: ProvidersService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create an AI provider' })
  @ApiResponse({ status: 201, description: 'Provider created successfully.' })
  @ApiResponse({ status: 400, description: 'Provider details are invalid.' })
  @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
  @ApiResponse({ status: 403, description: 'Administrator role is required.' })
  create(@Body() dto: CreateProviderDto) { return this.service.create(dto); }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'List all AI providers' })
  @ApiResponse({ status: 200, description: 'Providers returned successfully.' })
  @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
  @ApiResponse({ status: 403, description: 'Administrator role is required.' })
  findAll() { return this.service.findAll(); }

  @Get('enabled')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List enabled AI providers' })
  @ApiResponse({ status: 200, description: 'Enabled providers returned successfully.' })
  @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
  findEnabled() { return this.service.findEnabled(); }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get an AI provider' })
  @ApiResponse({ status: 200, description: 'Provider returned successfully.' })
  @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
  @ApiResponse({ status: 403, description: 'Administrator role is required.' })
  @ApiResponse({ status: 404, description: 'Provider was not found.' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update an AI provider' })
  @ApiResponse({ status: 200, description: 'Provider updated successfully.' })
  @ApiResponse({ status: 400, description: 'Provider details are invalid.' })
  @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
  @ApiResponse({ status: 403, description: 'Administrator role is required.' })
  @ApiResponse({ status: 404, description: 'Provider was not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateProviderDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete an AI provider' })
  @ApiResponse({ status: 200, description: 'Provider deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
  @ApiResponse({ status: 403, description: 'Administrator role is required.' })
  @ApiResponse({ status: 404, description: 'Provider was not found.' })
  remove(@Param('id') id: string) { return this.service.remove(id); }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Set provider enabled status' })
  @ApiResponse({ status: 200, description: 'Provider status updated successfully.' })
  @ApiResponse({ status: 400, description: 'Provider status is invalid.' })
  @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
  @ApiResponse({ status: 403, description: 'Administrator role is required.' })
  @ApiResponse({ status: 404, description: 'Provider was not found.' })
  setStatus(@Param('id') id: string, @Body() dto: ToggleStatusDto) {
    return this.service.setStatus(id, dto.isEnabled);
  }

  @Patch(':id/default')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Set the default AI provider' })
  @ApiResponse({ status: 200, description: 'Default provider updated successfully.' })
  @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
  @ApiResponse({ status: 403, description: 'Administrator role is required.' })
  @ApiResponse({ status: 404, description: 'Provider was not found.' })
  setDefault(@Param('id') id: string) { return this.service.setDefault(id); }

  @Get(':id/health')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get provider health check status' })
  @ApiResponse({ status: 200, description: 'Health check status returned.' })
  @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
  @ApiResponse({ status: 403, description: 'Administrator role is required.' })
  healthCheck(@Param('id') id: string) { return this.service.healthCheck(id); }
}