import { TokenType } from "../enums/token-type.enum";

export interface JwtPayload {
  sub: string;
  email: string;
  tokenType: TokenType.ACCESS | TokenType.REFRESH;
}
