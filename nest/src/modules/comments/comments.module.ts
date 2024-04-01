import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment, CommentsSchema } from 'src/entities/comments.mongo';
import { Book, BooksSchema } from 'src/entities/books.mongo';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentsSchema },
      { name: Book.name, schema: BooksSchema },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [],
})
export class CommentsModule {}
