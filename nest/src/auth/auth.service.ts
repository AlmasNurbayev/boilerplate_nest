import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './schemas/register.dto';
import { LoginDto, LoginType } from './schemas/login.dto';
import { UserWithoutPasswordDto } from './schemas/user.dto';
import { AuthUserDto } from './schemas/auth.dto';
import * as bcrypt from 'bcrypt';
import { AuthCommonService } from './common/auth.common.service';
import { Request } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  RequestConfirmDto,
  RequestConfirmReturnDto,
  SubmitConfirmDto,
  SubmitConfirmReturnDto,
} from './schemas/confirm.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ConfirmRedis } from './interfaces/confirm_redis';

@Injectable()
export class AuthService {
  constructor(
    protected readonly configService: ConfigService,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly authCommonService: AuthCommonService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mailerService: MailerService,
  ) {}

  async login(userDto: LoginDto): Promise<AuthUserDto> {
    let user;
    if (userDto.type === LoginType.email) {
      user = await this.userRepository.findOne({
        select: ['id', 'email', 'password', 'created_at'],
        where: { email: userDto.login },
      });
    } else if (userDto.type === LoginType.phone) {
      user = await this.userRepository.findOne({
        select: ['id', 'email', 'password', 'created_at'],
        where: { phone: userDto.login },
      });
    }
    if (!user) {
      throw new UnauthorizedException('login or password not correct');
    }
    const passwordCorrect = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (!passwordCorrect) {
      throw new UnauthorizedException('email or password not correct');
    }
    let accessToken, refreshToken;
    if (userDto.type === LoginType.email) {
      accessToken = await this.authCommonService.generateAccessToken({
        type: LoginType.email,
        login: user.email,
        id: user.id,
      });
      refreshToken = await this.authCommonService.generateRefreshToken({
        type: LoginType.email,
        login: user.email,
        id: user.id,
      });
    } else if (userDto.type === LoginType.phone) {
      accessToken = await this.authCommonService.generateAccessToken({
        type: LoginType.phone,
        login: user.phone,
        id: user.id,
      });
      refreshToken = await this.authCommonService.generateRefreshToken({
        type: LoginType.phone,
        login: user.phone,
        id: user.id,
      });
    }
    const { password: _, ...userWithoutPassword } = user; // eslint-disable-line
    await this.cacheManager.set(user.id.toString(), userWithoutPassword); // добавляем в кеш
    return {
      user: userWithoutPassword,
      accessToken: 'Bearer ' + accessToken,
      refreshToken: 'Bearer ' + refreshToken,
    };
  }

  async register(userDto: RegisterDto): Promise<UserWithoutPasswordDto> {
    if (!userDto.email && !userDto.phone) {
      throw new HttpException(
        'Must be content email or phone',
        HttpStatus.BAD_REQUEST,
      );
    }
    // ищем пользователя с совпадением email или phone
    const existUser = await this.userRepository.findOneBy([
      { email: userDto.email },
      { phone: userDto.phone },
    ]);
    if (existUser) {
      throw new HttpException(
        'login data already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    // проверяем подтвержден ли email или телефон. Если заданы оба - проверяем email
    if (userDto.email) {
      const confirm = await this.cacheManager.get<ConfirmRedis>(userDto.email);
      if (!confirm || !confirm?.confirmed_at) {
        throw new HttpException(
          'email is not confirmed',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (userDto.phone) {
      const confirm = await this.cacheManager.get<ConfirmRedis>(userDto.phone);
      if (!confirm || !confirm?.confirmed_at) {
        throw new HttpException(
          'phone is not confirmed',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const user = await this.userRepository.save({
      email: userDto.email,
      phone: userDto.phone,
      password: await bcrypt.hash(userDto.password, 10),
    });
    const { password: _, ...userWithoutPassword } = user; // eslint-disable-line
    return userWithoutPassword;
  }

  async refresh(req: Request) {
    let inputRefreshToken = req.cookies?.refresh_qtim;
    if (!inputRefreshToken) {
      throw new UnauthorizedException();
    }
    inputRefreshToken = inputRefreshToken.replace('Bearer ', '');
    // проверяем токен из куки
    const { type, login, id } =
      await this.authCommonService.verifyRefreshToken(inputRefreshToken);
    // проверяем payload
    let user;
    if (type === LoginType.email) {
      user = await this.userRepository.findOneBy({ email: login });
    } else if (type === LoginType.phone) {
      user = await this.userRepository.findOneBy({ phone: login });
    }

    if (!user || user.id !== id) {
      throw new UnauthorizedException();
    }
    // создаем новую пару токенов
    const accessToken =
      'Bearer ' +
      (await this.authCommonService.generateAccessToken({
        type,
        login,
        id,
      }));
    const refreshToken =
      'Bearer ' +
      (await this.authCommonService.generateRefreshToken({
        type,
        login,
        id,
      }));
    return { accessToken, refreshToken };
  }

  requestConfirm(data: RequestConfirmDto): RequestConfirmReturnDto {
    const code = Math.floor(100000 + Math.random() * 900000);
    this.cacheManager.set(data.login, {
      login: data.login,
      type: 'confirm',
      loginType: data.type,
      created_at: Date.now(),
      code,
    });

    let success = false;

    if (data.type === LoginType.email) {
      try {
        // отправляем ассинхронно и не дожидаемся ответа, чтобы не тормозить сервис
        this.mailerService.sendMail({
          from: this.configService.get('mailer.transport.auth.user'),
          to: data.login,
          subject: 'confirm code ' + this.configService.get('name'),
          text: 'use this code: ' + code,
        });
        success = true;
      } catch (error) {
        success = false;
        Logger.error(error);
      }
    } else if (data.type === LoginType.phone) {
    } else {
      throw new HttpException('Incorrect type', HttpStatus.BAD_REQUEST);
    }

    return {
      message: success ? 'message sended' : 'message not sended',
    };
  }

  async submitConfirm(data: SubmitConfirmDto): Promise<SubmitConfirmReturnDto> {
    const confirm: ConfirmRedis = await this.cacheManager.get(data.login);
    if (!confirm) {
      throw new HttpException('Not found confirm', HttpStatus.BAD_REQUEST);
    }
    if (confirm.created_at - Date.now() > 5 * 60 * 1000) {
      throw new HttpException('Expected code', HttpStatus.BAD_REQUEST);
    }
    if (confirm.loginType !== data.type) {
      throw new HttpException('Incorrect type', HttpStatus.BAD_REQUEST);
    }
    if (confirm.code !== data.code) {
      throw new HttpException('Incorrect code', HttpStatus.BAD_REQUEST);
    }
    await this.cacheManager.set(data.login, {
      ...confirm,
      confirmed_at: Date.now(),
    });
    return {
      message: 'confirmed',
    };
  }
}
