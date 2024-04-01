import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/pagination.dto';

export class CommentsCreateDto {
  @ApiProperty({ required: true })
  @IsString()
  title: string;

  @ApiProperty({ required: true })
  @IsString()
  text: string;

  @ApiProperty({ required: true })
  @IsString()
  book: string;
}

export class CommentsFullDto {
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
  @IsString()
  book: string;

  @ApiProperty({ required: true })
  @IsDateString()
  created_at: Date;
}

export class CommentsListDto {
  @ApiProperty({ type: [CommentsFullDto], required: true })
  @IsArray()
  data: CommentsFullDto[];

  @ApiProperty({ required: true })
  count: number;
}

export class CommentsFilterDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  _id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  text: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  book_id: string;
}

export class CommentsUpdateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  text: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  book: string;
}
