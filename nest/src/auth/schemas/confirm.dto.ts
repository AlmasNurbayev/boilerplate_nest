import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber } from 'class-validator';
import { LoginType } from './login.dto';
import { Transform } from 'class-transformer';

export class RequestConfirmDto {
  @ApiProperty({
    required: true,
    description:
      'email or phone with format - only digits for example 77081234567',
  })
  @IsString()
  login: string;

  @ApiProperty({
    required: true,
    description: 'set email or phone for choose transport type',
    example: 'email',
  })
  @IsEnum(LoginType)
  type: LoginType;
}

export class RequestConfirmReturnDto {
  @ApiProperty({ required: true })
  @IsString()
  message: string;
}

export class SubmitConfirmDto {
  @ApiProperty({
    required: true,
    description:
      'email or phone with format - only digits for example 77081234567',
  })
  @IsString()
  login: string;

  @ApiProperty({
    required: true,
    description: 'set email or phone for choose transport type',
    example: 'email',
  })
  @IsEnum(LoginType)
  type: LoginType;

  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    required: true,
    description: 'received digital code from email/phone',
  })
  @IsNumber()
  code: number;
}

export class SubmitConfirmReturnDto {
  @ApiProperty({ required: true })
  @IsString()
  message: string;
}
