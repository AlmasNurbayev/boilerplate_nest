import { ApiProperty } from '@nestjs/swagger';
import { UserWithoutPasswordDto } from './user.dto';

export class AuthUserDto {
  @ApiProperty({ required: true })
  user: UserWithoutPasswordDto;

  @ApiProperty({ required: true })
  accessToken: string;

  @ApiProperty({ required: true })
  refreshToken: string;
}
