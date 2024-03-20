import {
  Controller,
  Get,
  UsePipes,
  ValidationPipe,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  UserFullDto,
  UserListDto,
  UserWithoutPasswordDto,
} from './schemas/user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'by id' })
  @ApiResponse({ status: 200, type: UserWithoutPasswordDto })
  @ApiBadRequestResponse({ description: 'id # does not exist' })
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getById(id);
  }

  @Get()
  @ApiOperation({ description: 'Get all by parameteres' })
  @ApiResponse({ status: 200, type: UserListDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  list() {
    return this.usersService.list();
  }
}
