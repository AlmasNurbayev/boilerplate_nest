import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ example: 10, required: false })
  @IsNumber()
  @IsOptional()
  take: number;

  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ example: 20, required: false })
  @IsNumber()
  @IsOptional()
  skip: number;

  @ApiProperty({ example: 'id DESC', required: false })
  @IsString()
  @IsOptional()
  order: string;
}
