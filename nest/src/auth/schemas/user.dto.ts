import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty({ minLength: 0, maxLength: 254 })
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsBoolean()
  is_confirmed: boolean;

  @ApiProperty()
  @IsDateString()
  created_at: Date;
}

export class UserWithoutPasswordDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty({ minLength: 0, maxLength: 254 })
  @IsString()
  email: string;

  // @ApiProperty()
  // @IsString()
  // password: string;

  @ApiProperty()
  @IsBoolean()
  is_confirmed: boolean;

  @ApiProperty()
  @IsDateString()
  created_at: Date;
}
