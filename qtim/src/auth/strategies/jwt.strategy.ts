import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { LoginDto } from '../schemas/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

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
      passReqToCallback: true,
    });
  }

  async validate(payload: LoginDto) {
    if (!payload) {
      throw new UnauthorizedException();
    }
    const user = await this.usersRepository.findOneBy({ email: payload.email });
    if (!user) {
      throw new UnauthorizedException('email or password not correct');
    }
    if (!user.is_confirmed) {
      throw new HttpException('User is not confirmed', HttpStatus.BAD_REQUEST);
    }
    const { password, ...UserWithoutPassword } = user;
    return UserWithoutPassword;
  }
}
