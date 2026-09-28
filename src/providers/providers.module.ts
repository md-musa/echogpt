import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RolesGuard } from '../common/guards/roles.guard';
import { MockAdapter } from './adapters/mock.adapter';
import { OpenAiAdapter } from './adapters/openai.adapter';
import { ProviderAdapterFactory } from './adapters/provider-adapter.factory';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [ProvidersController],
  providers: [ProvidersService, RolesGuard, OpenAiAdapter, MockAdapter, ProviderAdapterFactory],
  exports: [ProvidersService, ProviderAdapterFactory],
})
export class ProvidersModule { }
