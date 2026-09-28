import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProvidersService } from './providers.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ToggleStatusDto } from './dto/toggle-status.dto';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly service: ProvidersService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateProviderDto) { return this.service.create(dto); }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll() { return this.service.findAll(); }

  @Get('enabled')
  @UseGuards(JwtAuthGuard)
  findEnabled() { return this.service.findEnabled(); }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateProviderDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) { return this.service.remove(id); }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  setStatus(@Param('id') id: string, @Body() dto: ToggleStatusDto) {
    return this.service.setStatus(id, dto.isEnabled);
  }

  @Patch(':id/default')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  setDefault(@Param('id') id: string) { return this.service.setDefault(id); }

  @Get(':id/health')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  healthCheck(@Param('id') id: string) { return this.service.healthCheck(id); }
}