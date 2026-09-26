import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { clearTokenCookie, setTokenInCookies } from './utilities/setTokenInCookies.util';
import type { Request, Response } from 'express';
import { AuthTokensResponse } from './interfaces/auth-response.interface';
import { RequestUser } from './interfaces/request-user.interface';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() signupAuthDto: SignUpAuthDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthTokensResponse> {
    const { accessToken, refreshToken, user } = await this.authService.signup(signupAuthDto);

    setTokenInCookies(res, refreshToken);
    return { accessToken, user };
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(
    @Body() signinAuthDto: SignInAuthDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthTokensResponse> {
    const { accessToken, refreshToken, user } = await this.authService.signin(signinAuthDto);

    setTokenInCookies(res, refreshToken);
    return { accessToken, user };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  async generateRefreshToken(
    @Req() req: Request & { user: RequestUser },
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthTokensResponse> {

    console.log('req.user:', req.user);

    const { accessToken, refreshToken, user } = await this.authService.generateRefreshToken(req.user);

    setTokenInCookies(res, refreshToken);
    return { accessToken, user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  async logout(
    @Req() req: Request & { user: RequestUser },
    @Res({ passthrough: true }) res: Response
  ): Promise<{ message: string }> {

    await this.authService.logout(req.user);
    clearTokenCookie(res);

    return { message: 'Logged out successfully' };
  }
}
