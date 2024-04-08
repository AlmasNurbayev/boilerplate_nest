import { IsEnum, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum LoginType {
  phone = 'phone',
  email = 'email',
}

export class LoginDto {
  @ApiProperty({
    required: true,
    description:
      'email or phone with format - only digits for example 77081234567',
  })
  @IsString()
  login: string;

  @ApiProperty({ required: true, description: 'type login - email or phone' })
  @IsEnum(LoginType)
  type: LoginType;

  @ApiProperty({ minLength: 6, required: true })
  @MinLength(6, { message: 'Password should be at least 6 characters long' })
  @IsString()
  password: string;
}
