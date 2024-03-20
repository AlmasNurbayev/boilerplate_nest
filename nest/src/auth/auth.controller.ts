import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './schemas/login.dto';
import { RegisterDto } from './schemas/register.dto';
import { UserWithoutPasswordDto } from './schemas/user.dto';
import { AuthUserDto } from './schemas/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Users authorisation')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'login existing user' })
  @ApiResponse({ status: 200, type: AuthUserDto })
  async login(@Body() userData: LoginDto) {
    return this.authService.login(userData);
  }

  @Post('register')
  @ApiOperation({ summary: 'register user' })
  @ApiResponse({ status: 201, type: UserWithoutPasswordDto })
  async register(@Body() userData: RegisterDto) {
    return this.authService.register(userData);
  }
}
