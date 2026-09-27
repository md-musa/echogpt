import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareHashedData, hashData } from './utilities/hash.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthResult, AuthTokens, AuthUser } from './interfaces/auth-response.interface';
import { TokenType } from './enums/token-type.enum';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { ConfigService } from '@nestjs/config';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { RequestUser } from './interfaces/request-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  async signup(signupAuthDto: SignUpAuthDto): Promise<AuthResult> {
    const { email, password, name } = signupAuthDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      throw new ConflictException('User with this email already exist');
    }

    const saltRounds = this.configService.get<string>("BCRYPT_SALT_ROUNDS");
    if (!saltRounds) throw new InternalServerErrorException("Something went wrong")

    const hashedPassword = await hashData(password, parseInt(saltRounds));
    const newUser = await this.prisma.user.create({
      data: {
        password: hashedPassword,
        email,
        name,
        subscription: {
          create: {
            plan: 'FREE', status: "ACTIVE"
          }
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    const { accessToken, refreshToken } = await this.generateTokens(newUser.id, newUser.email);
    await this.storeRefreshToken(newUser.id, refreshToken);

    return {
      user: newUser,
      accessToken,
      refreshToken,
    };
  }

  async signin(signinAuthDto: SignInAuthDto): Promise<AuthResult> {
    const { email, password } = signinAuthDto;

    const user = await this.prisma.user.findUnique({
      where: { email },

    });

    if (!user) {
      throw new NotFoundException('User does not exist with this email');
    }

    const isMatched = await compareHashedData(password, user.password);
    if (!isMatched) {
      throw new UnauthorizedException('Invalid password');
    }

    const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email);
    await this.storeRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: this.toAuthUser(user),
    };
  }

  async generateRefreshToken(user: RequestUser): Promise<AuthResult> {
    const refreshToken = user.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { id: user.sub },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (!existingUser.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isRefreshTokenValid = await compareHashedData(refreshToken, existingUser.refreshTokenHash);

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(existingUser.id, existingUser.email);
    const hashedRefreshToken = await hashData(tokens.refreshToken);
    const rotation = await this.prisma.user.updateMany({
      where: { id: existingUser.id, refreshTokenHash: existingUser.refreshTokenHash },
      data: { refreshTokenHash: hashedRefreshToken },
    });

    if (rotation.count !== 1) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return {
      ...tokens,
      user: this.toAuthUser(existingUser),
    };
  }

  async logout(user: RequestUser): Promise<void> {
    const refreshToken = user.refreshToken;
    if (!refreshToken) return;

    const existingUser = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: { id: true, refreshTokenHash: true },
    });
    if (!existingUser?.refreshTokenHash) return;

    const isRefreshTokenValid = await compareHashedData(refreshToken, existingUser.refreshTokenHash);
    if (!isRefreshTokenValid) return;

    await this.prisma.user.updateMany({
      where: { id: existingUser.id, refreshTokenHash: existingUser.refreshTokenHash },
      data: { refreshTokenHash: null },
    });
  }

  private async generateTokens(userId: string, email: string): Promise<AuthTokens> {
    const payload = { sub: userId, email };

    const accessToken = await this.jwtService.signAsync({ ...payload, tokenType: TokenType.ACCESS }, {
      secret: this.configService.get("ACCESS_TOKEN_SECRET"),
      expiresIn: this.configService.get("ACCESS_TOKEN_EXPIRES_IN")
    });

    const refreshToken = await this.jwtService.signAsync({ ...payload, tokenType: TokenType.REFRESH }, {
      secret: this.configService.get("REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get("REFRESH_TOKEN_EXPIRES_IN")
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await hashData(refreshToken);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hashedRefreshToken },
    });
  }

  private toAuthUser(user: { id: string; email: string; name: string }): AuthUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
