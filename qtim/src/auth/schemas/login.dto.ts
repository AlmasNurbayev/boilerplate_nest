import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 6, required: true })
  @MinLength(6, { message: 'Password should be at least 6 characters long' })
  @IsString()
  password: string;
}
