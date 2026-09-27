import { Injectable } from '@nestjs/common';
import { AiProvider } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { decrypt, encrypt, maskApiKey } from './utils/crypto.util';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';

@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateProviderDto) {
    const provider = await this.prisma.aiProvider.create({
      data: {
        type: dto.type,
        name: dto.name,
        encryptedKey: encrypt(dto.apiKey),
        keyPreview: maskApiKey(dto.apiKey),
        defaultModel: dto.defaultModel,
      },
    });
    return this.toSafeProvider(provider);
  }

  async findAll() {
    const providers = await this.prisma.aiProvider.findMany({ orderBy: { createdAt: 'asc' } });
    return providers.map((provider) => this.toSafeProvider(provider));
  }

  async findEnabled() {
    return this.prisma.aiProvider.findMany({
      where: { isEnabled: true },
      select: { id: true, name: true, type: true, defaultModel: true, isDefault: true },
    });
  }

  async findOne(id: string) {
    const provider = await this.prisma.aiProvider.findUniqueOrThrow({ where: { id } });
    return this.toSafeProvider(provider);
  }

  async update(id: string, dto: UpdateProviderDto) {
    const provider = await this.prisma.aiProvider.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.defaultModel !== undefined && { defaultModel: dto.defaultModel }),
        ...(dto.apiKey !== undefined && {
          encryptedKey: encrypt(dto.apiKey),
          keyPreview: maskApiKey(dto.apiKey),
        }),
      },
    });
    return this.toSafeProvider(provider);
  }

  async remove(id: string) {
    await this.prisma.aiProvider.delete({ where: { id } });
    return { message: 'Provider deleted successfully' };
  }

  async setStatus(id: string, isEnabled: boolean) {
    const provider = await this.prisma.aiProvider.update({ where: { id }, data: { isEnabled } });
    return this.toSafeProvider(provider);
  }

  async setDefault(id: string) {
    const [, provider] = await this.prisma.$transaction([
      this.prisma.aiProvider.updateMany({ data: { isDefault: false } }),
      this.prisma.aiProvider.update({ where: { id }, data: { isDefault: true } }),
    ]);
    return this.toSafeProvider(provider);
  }

  async healthCheck(id: string) {
    // const provider = await this.prisma.aiProvider.findUniqueOrThrow({ where: { id } });
    // const result = await checkProviderHealth(provider.type, decrypt(provider.encryptedKey));
    // return { providerId: id, ...result };
    return "Health check functionality is currently disabled for security reasons. Please contact the administrator for more information.";
  }

  private toSafeProvider<T extends AiProvider>(provider: T): Omit<T, 'encryptedKey'> {
    const { encryptedKey: _encryptedKey, ...safeProvider } = provider;
    return safeProvider;
  }
}