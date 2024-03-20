import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './schemas/register.dto';
import { LoginDto } from './schemas/login.dto';
import { UserWithoutPasswordDto } from './schemas/user.dto';
import { AuthUserDto } from './schemas/auth.dto';
import * as bcrypt from 'bcrypt';
import { AuthCommonService } from './common/auth.common.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly authCommonService: AuthCommonService,
  ) {}

  async login(userDto: LoginDto): Promise<AuthUserDto> {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password', 'is_confirmed', 'created_at'],
      where: { email: userDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('email or password not correct');
    }
    if (!user.is_confirmed) {
      throw new HttpException('User is not confirmed', HttpStatus.BAD_REQUEST);
    }
    if (!(await bcrypt.compare(userDto.password, user.password))) {
      throw new UnauthorizedException('email or password not correct');
    }
    const token = await this.authCommonService.generateToken({
      email: user.email,
      id: user.id,
    });
    const { password: _, ...userWithoutPassword } = user; // eslint-disable-line
    return {
      user: userWithoutPassword,
      accessToken: 'Bearer ' + token,
      refreshToken: 'token',
    };
  }

  async register(userDto: RegisterDto): Promise<UserWithoutPasswordDto> {
    const existUser = await this.userRepository.findOneBy({
      email: userDto.email,
    });
    if (existUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.save({
      is_confirmed: true, // TODO: mail confirmed
      email: userDto.email,
      password: await bcrypt.hash(userDto.password, 10),
    });
    const { password: _, ...userWithoutPassword } = user;     // eslint-disable-line
    return userWithoutPassword;
  }
}
