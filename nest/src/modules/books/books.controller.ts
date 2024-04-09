import {
  Controller,
  Get,
  UseGuards,
  Param,
  Body,
  Post,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { BooksService } from './books.service';
import {
  BooksCreateDto,
  BooksFilterDto,
  BooksFullDto,
  BooksListDto,
  BooksUpdateDto,
} from './schemas/books.dto';
import { IdMongoPipe } from 'src/pipes/id_mongo.pipe';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiResponse({ status: 201, type: BooksFullDto })
  @ApiBody({ type: BooksCreateDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() data: BooksCreateDto) {
    return this.booksService.create(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'by id' })
  @ApiResponse({ status: 200, type: BooksFullDto })
  @ApiBadRequestResponse({ description: 'id # does not exist' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getById(@Param('id', IdMongoPipe) id: string) {
    return this.booksService.getById(id);
  }

  @Get()
  @ApiOperation({ description: 'Get all by parameteres' })
  @ApiResponse({ status: 200, type: BooksListDto })
  list(@Query() query: BooksFilterDto) {
    return this.booksService.list(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'by id' })
  @ApiBody({ type: BooksUpdateDto })
  @ApiResponse({ status: 200, type: BooksFullDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(@Param('id', IdMongoPipe) id: string, @Body() data: BooksUpdateDto) {
    return this.booksService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'by id' })
  @ApiResponse({ status: 200, type: BooksFullDto })
  @ApiBadRequestResponse({ description: 'id # does not exist' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  delete(@Param('id', IdMongoPipe) id: string) {
    return this.booksService.delete(id);
  }
}
