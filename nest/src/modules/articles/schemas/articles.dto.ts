import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from 'src/common/pagination.dto';

export class ArticlesFullDto {
  @ApiProperty({ required: true })
  @IsInt()
  id: number;

  @ApiProperty({ required: true })
  @IsString()
  title: string;

  @ApiProperty({ required: true })
  @IsString()
  text: string;

  @ApiProperty({ required: true })
  @IsInt()
  author_id: number;

  @ApiProperty({ required: true })
  @IsString()
  image_path: string;

  @ApiProperty({ required: true })
  @IsBoolean()
  is_publicated: boolean;

  @ApiProperty({ required: true })
  @IsDateString()
  created_at: Date;

  @ApiProperty({ required: true })
  @IsDateString()
  updated_at: Date;
}

export class ArticlesListDto {
  @ApiProperty({ type: [ArticlesFullDto], required: true })
  @IsArray()
  data: ArticlesFullDto[];

  @ApiProperty({ required: true })
  count: number;
}

export class ArticlesCreateDto {
  @ApiProperty({ required: true })
  @IsString()
  title: string;

  @ApiProperty({ required: true })
  @IsString()
  text: string;

  @ApiProperty({ required: true })
  @IsInt()
  author_id: number;

  @ApiProperty({ required: true })
  @IsString()
  image_path: string;
}

export class ArticlesUpdateDto {
  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  text: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  image_path: string;
}

export class ArticlesFilterDto extends PaginationDto {
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  id: number;

  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  author_id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  text: string;
}
