import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Book } from './books.mongo';

export type CommentsDocument = HydratedDocument<Comment>;

@Schema()
// название класса + "s" сопоставляется с коллекцией в MongoDB
export class Comment {
  @Prop({ type: SchemaTypes.String, required: true })
  title: string;

  @Prop({ type: SchemaTypes.String, required: true })
  text: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Book', required: true })
  book: Book;

  @Prop({ type: SchemaTypes.Date, default: Date.now })
  created_at: Date;
}

export const CommentsSchema = SchemaFactory.createForClass(Comment);
