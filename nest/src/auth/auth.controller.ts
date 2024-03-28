import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './schemas/login.dto';
import { RegisterDto } from './schemas/register.dto';
import { UserWithoutPasswordDto } from './schemas/user.dto';
import { AuthUserDto } from './schemas/auth.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
@ApiTags('Users authorisation')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'login existing user' })
  @ApiResponse({ status: 200, type: AuthUserDto })
  async login(@Body() userData: LoginDto, @Res() res: Response) {
    const responseBody = await this.authService.login(userData);
    // устанавливаем куку c RefreshToken и отправляем тело ответа напрямую через Express
    res.cookie('refresh_qtim', responseBody.refreshToken, { httpOnly: true });
    res.status(200).send(responseBody);
  }

  @Post('register')
  @ApiOperation({ summary: 'register user' })
  @ApiResponse({ status: 201, type: UserWithoutPasswordDto })
  async register(@Body() userData: RegisterDto) {
    return this.authService.register(userData);
  }
}
