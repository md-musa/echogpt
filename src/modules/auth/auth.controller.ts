import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { clearTokenCookie, setTokenInCookies } from './utilities/setTokenInCookies.util';
import type { Request, Response } from 'express';
import { AuthTokensResponse } from './interfaces/auth-response.interface';
import { RequestUser } from './interfaces/request-user.interface';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Request validation failed.' })
  @ApiResponse({ status: 409, description: 'A user with this email already exists.' })
  @ApiResponse({ status: 500, description: 'Registration could not be completed.' })
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
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 400, description: 'Request validation failed.' })
  @ApiResponse({ status: 401, description: 'The password is invalid.' })
  @ApiResponse({ status: 404, description: 'The user does not exist.' })
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
  @ApiOperation({ summary: 'Refresh authentication tokens' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully.' })
  @ApiResponse({ status: 401, description: 'The refresh token is missing or invalid.' })
  @ApiResponse({ status: 404, description: 'The user does not exist.' })
  async generateRefreshToken(
    @Req() req: Request & { user: RequestUser },
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthTokensResponse> {

    const { accessToken, refreshToken, user } = await this.authService.generateRefreshToken(req.user);

    setTokenInCookies(res, refreshToken);
    return { accessToken, user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Log out the current user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully.' })
  @ApiResponse({ status: 401, description: 'The refresh token is missing or invalid.' })
  async logout(
    @Req() req: Request & { user: RequestUser },
    @Res({ passthrough: true }) res: Response
  ): Promise<{ message: string }> {

    await this.authService.logout(req.user);
    clearTokenCookie(res);

    return { message: 'Logged out successfully' };
  }
}
