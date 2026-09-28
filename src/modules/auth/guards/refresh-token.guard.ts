import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { REFRESH_TOKEN_COOKIE } from '../constants/cookie.constant';
import { TokenType } from '../enums/token-type.enum';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { RequestUser } from '../interfaces/request-user.interface';

type RefreshTokenRequest = Request & { user?: RequestUser };

@Injectable()
export class RefreshTokenGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<RefreshTokenRequest>();
        const refreshToken = request.cookies?.[REFRESH_TOKEN_COOKIE];
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token is required');
        }

        const refreshSecret = this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET');
        let payload: JwtPayload;
        try {
            payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
                secret: refreshSecret,
            });
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }

        if (
            payload.tokenType !== TokenType.REFRESH ||
            typeof payload.sub !== 'string' ||
            typeof payload.email !== 'string'
        ) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        request.user = { ...payload, refreshToken };
        return true;
    }
}