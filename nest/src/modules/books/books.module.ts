import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BooksSchema } from '../../entities/books.mongo';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BooksSchema }]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [],
})
export class BooksModule {}
