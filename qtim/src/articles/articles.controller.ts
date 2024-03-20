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
  Req,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { ArticlesCreateDto, ArticlesFilterDto, ArticlesFullDto, ArticlesListDto } from './shemas/articles.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiResponse({ status: 201, type: ArticlesFullDto })
  @ApiBody({ type: ArticlesCreateDto })
  @UsePipes(new ValidationPipe({ transform: true }))
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
}
