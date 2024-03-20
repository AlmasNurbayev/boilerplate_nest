import {
  Controller,
  Get,
  UsePipes,
  ValidationPipe,
  Param,
  ParseIntPipe,
  Body,
  Post,
  UseGuards,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import {
  ArticlesCreateDto,
  ArticlesFilterDto,
  ArticlesFullDto,
  ArticlesListDto,
  ArticlesUpdateDto,
} from './schemas/articles.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiResponse({ status: 201, type: ArticlesFullDto })
  @ApiBody({ type: ArticlesCreateDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() data: ArticlesCreateDto) {
    return this.articlesService.create(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'by id' })
  @ApiResponse({ status: 200, type: ArticlesFullDto })
  @ApiBadRequestResponse({ description: 'id # does not exist' })
  @UsePipes(new ValidationPipe())
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.getById(id);
  }

  @Get()
  @ApiOperation({ description: 'Get all by parameteres' })
  @ApiResponse({ status: 200, type: ArticlesListDto })
  list(@Query() query: ArticlesFilterDto) {
    return this.articlesService.list(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'by id' })
  @ApiBody({ type: ArticlesUpdateDto })
  @ApiResponse({ status: 200, type: ArticlesFullDto })
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ArticlesUpdateDto,
  ): Promise<ArticlesFullDto> {
    return await this.articlesService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'by id' })
  @ApiResponse({ status: 200, type: ArticlesFullDto })
  @ApiBadRequestResponse({ description: 'id # does not exist' })
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.delete(id);
  }
}
