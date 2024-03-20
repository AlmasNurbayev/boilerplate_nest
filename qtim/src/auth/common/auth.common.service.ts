import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../schemas/user.dto';
import { LoginDto } from '../schemas/login.dto';
import { JwtPayload } from '../interfaces/jwt_payload';

@Injectable()
export class AuthCommonService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }
}
