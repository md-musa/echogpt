import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RoleName } from '../../generated/prisma/enums';
import { compareHashedData, hashData } from '../auth/utilities/hash.util';
import { PrismaService } from '../../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from '../../generated/prisma/models';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) { }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    if (dto.name === undefined) {
      throw new BadRequestException('Provide a name to update');
    }

    const result = await this.prisma.user.updateMany({
      where: { id: userId, deletedAt: null },
      data: { name: dto.name },
    });
    if (result.count !== 1) throw new NotFoundException('User not found');
    return this.getProfile(userId);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.getUserWithPassword(userId, dto.currentPassword);

    if (await compareHashedData(dto.newPassword, user.password)) {
      throw new BadRequestException('New password must be different');
    }

    await this.prisma.user.update({
      where: { id: userId, password: user.password, deletedAt: null },
      data: {
        password: await hashData(dto.newPassword, this.getSaltRounds()),
        refreshTokenHash: null,
      },
      select: { id: true },
    });
    return { message: 'Password changed successfully' };
  }

  async deleteAccount(userId: string, dto: DeleteAccountDto): Promise<{ message: string }> {
    const user = await this.getUserWithPassword(userId, dto.currentPassword);
    await this.prisma.user.update({
      where: { id: userId, password: user.password, deletedAt: null },
      data: { deletedAt: new Date(), refreshTokenHash: null },
      select: { id: true },
    });
    return { message: 'Account deleted successfully' };
  }

  async updateRole(actorId: string, targetId: string, role: RoleName) {
    const actor = await this.prisma.user.findFirst({
      where: { id: actorId, deletedAt: null },
      select: { role: true },
    });
    if (!actor) throw new UnauthorizedException();
    if (actor.role !== RoleName.ADMIN) throw new ForbiddenException('Admin role required');

    const result = await this.prisma.user.updateMany({
      where: { id: targetId, deletedAt: null },
      data: { role },
    });
    if (result.count !== 1) throw new NotFoundException('User not found');
    return this.getProfile(targetId);
  }

  private async getUserWithPassword(userId: string, currentPassword: string): Promise<Pick<UserModel, 'id' | 'password'>> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: { id: true, password: true },
    });
    if (!user || !(await compareHashedData(currentPassword, user.password))) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    return user;
  }

  private getSaltRounds(): number {
    const rounds = Number(this.configService.get<string>('BCRYPT_SALT_ROUNDS'));
    return rounds;
  }
}
