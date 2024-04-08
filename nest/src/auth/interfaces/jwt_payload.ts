import { LoginType } from '../schemas/login.dto';

export interface JwtPayload {
  type: LoginType;
  login: string;
  id: number;
}
