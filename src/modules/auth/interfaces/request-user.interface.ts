import { JwtPayload } from "./jwt-payload.interface";

export interface RequestUser extends JwtPayload {
    refreshToken?: string;
}