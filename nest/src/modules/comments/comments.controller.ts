import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import {
  CommentsCreateDto,
  CommentsFilterDto,
  CommentsFullDto,
  CommentsListDto,
  CommentsUpdateDto,
} from './schemas/comments.dto';
import {
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiOperation,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiResponse({ status: 201, type: CommentsFullDto })
  @ApiBody({ type: CommentsCreateDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() data: CommentsCreateDto) {
    return this.commentsService.create(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'by id' })
  @ApiResponse({ status: 200, type: CommentsFullDto })
  @ApiBadRequestResponse({ description: 'id # does not exist' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getById(@Param('id') id: string) {
    return this.commentsService.getById(id);
  }

  @Get()
  @ApiOperation({ description: 'Get all by parameteres' })
  @ApiResponse({ status: 200, type: CommentsListDto })
  list(@Query() query: CommentsFilterDto) {
    return this.commentsService.list(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'by id' })
  @ApiBody({ type: CommentsUpdateDto })
  @ApiResponse({ status: 200, type: CommentsFullDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() data: CommentsUpdateDto) {
    return this.commentsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'by id' })
  @ApiResponse({ status: 200, type: CommentsFullDto })
  @ApiBadRequestResponse({ description: 'id # does not exist' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.commentsService.delete(id);
  }
}
