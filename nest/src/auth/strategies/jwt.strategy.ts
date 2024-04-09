import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../entities/users.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt_payload';
import { LoginType } from '../schemas/login.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    protected readonly configService: ConfigService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload) {
      throw new UnauthorizedException();
    }
    let user;
    if (payload.type === LoginType.email) {
      user = await this.usersRepository.findOneBy({ email: payload.login });
    } else if (payload.type === LoginType.phone) {
      user = await this.usersRepository.findOneBy({ phone: payload.login });
    }
    if (!user || user.id !== payload.id) {
      throw new UnauthorizedException();
    }
    const { password: _, ...UserWithoutPassword } = user; // eslint-disable-line
    return UserWithoutPassword;
  }
}
