export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthTokensResponse {
  accessToken: string;
  user: AuthUser;
}

export interface AuthResult extends AuthTokens {
  user: AuthUser;
}
