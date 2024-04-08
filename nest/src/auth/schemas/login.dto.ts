import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum LoginType {
  phone = 'phone',
  email = 'email',
}

export class LoginDto {
  @ApiProperty({ required: true })
  @IsString()
  login: string;

  @ApiProperty({ required: true })
  @IsEnum(LoginType)
  type: LoginType;

  @ApiProperty({ minLength: 6, required: true })
  @MinLength(6, { message: 'Password should be at least 6 characters long' })
  @IsString()
  password: string;
}
