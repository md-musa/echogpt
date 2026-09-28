import { TokenType } from "../enums/token-type.enum";
import { RoleName } from "../../../generated/prisma/enums";

export interface JwtPayload {
  sub: string;
  email: string;
  role: RoleName;
  tokenType: TokenType.ACCESS | TokenType.REFRESH;
}
