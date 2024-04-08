import { LoginType } from '../schemas/login.dto';

export interface ConfirmRedis {
  type: string;
  loginType: LoginType;
  login: string;
  code: number;
  created_at: number; // timestamp
  confirmed_at?: number; // timestamp
}
