import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/pagination.dto';

export class BooksFullDto {
  @ApiProperty({ required: true })
  @IsString()
  _id: string;

  @ApiProperty({ required: true })
  @IsString()
  title: string;

  @ApiProperty({ required: true })
  @IsString()
  text: string;

  @ApiProperty({ required: true })
  @IsDateString()
  created_at: Date;
}

export class BooksListDto {
  @ApiProperty({ type: [BooksFullDto], required: true })
  @IsArray()
  data: BooksFullDto[];

  @ApiProperty({ required: true })
  count: number;
}

export class BooksCreateDto {
  @ApiProperty({ required: true })
  @IsString()
  title: string;

  @ApiProperty({ required: true })
  @IsString()
  text: string;
}

export class BooksUpdateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  text: string;
}

export class BooksFilterDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  _id: string;

  @ApiProperty({
    required: false,
    description: 'search in string fields, entire word must match',
  })
  @IsOptional()
  @IsString()
  searchText: string;
}
