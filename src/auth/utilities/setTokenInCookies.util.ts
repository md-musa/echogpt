import type { Response } from 'express';
import { REFRESH_TOKEN_COOKIE } from '../constants/cookie.constant';

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export function setTokenInCookies(res: Response, refreshToken: string) {
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshTokenCookieOptions);
}

export function clearTokenCookie(res: Response) {
  res.clearCookie(REFRESH_TOKEN_COOKIE, refreshTokenCookieOptions);
}
