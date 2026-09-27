import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [ProvidersController],
  providers: [ProvidersService, RolesGuard],
  exports: [ProvidersService],
})
export class ProvidersModule { }
