import { IsArray, IsDateString, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserFullDto {
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
  @IsDateString()
  created_at: Date;
}

export class UserListDto {
  @ApiProperty({ type: [UserWithoutPasswordDto], required: true })
  @IsArray()
  data: UserWithoutPasswordDto[];

  @ApiProperty({ required: true })
  count: number;
}
