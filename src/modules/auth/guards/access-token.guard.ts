import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { TokenType } from '../enums/token-type.enum';
import { RequestUser } from '../interfaces/request-user.interface';

type UserRequest = Request & { user?: RequestUser };

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<UserRequest>();
        const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
        if (scheme !== 'Bearer' || !token) throw new UnauthorizedException('Access token required');

        let payload: RequestUser;
        try {
            payload = await this.jwtService.verifyAsync<RequestUser>(token, {
                secret: this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
            });
        } catch {
            throw new UnauthorizedException('Invalid access token');
        }

        if (payload.tokenType !== TokenType.ACCESS || typeof payload.sub !== 'string') {
            throw new UnauthorizedException('Invalid access token');
        }
        request.user = payload;
        return true;
    }
}