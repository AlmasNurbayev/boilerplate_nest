import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Comment } from './comments.mongo';

export type BooksDocument = HydratedDocument<Book>;

@Schema()
// название класса + "s" сопоставляется с коллекцией в MongoDB
export class Book {
  @Prop({ type: SchemaTypes.String, required: true })
  title: string;

  @Prop({ type: SchemaTypes.String, required: true })
  text: string;

  @Prop({ type: SchemaTypes.Date, default: Date.now })
  created_at: Date;

  @Prop([{ type: SchemaTypes.ObjectId, ref: 'Comment' }])
  comments: Comment[];
}

export const BooksSchema = SchemaFactory.createForClass(Book);
BooksSchema.index({ title: 'text', text: 'text' });
