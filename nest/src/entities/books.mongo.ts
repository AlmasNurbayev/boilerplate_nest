import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';

export type BookssDocument = HydratedDocument<Book>;

@Schema()
// название класса + "s" сопоставляется с коллекцией в MongoDB
export class Book {
  @Prop({ type: SchemaTypes.String, required: true, unique: true })
  title: string;

  @Prop({ type: SchemaTypes.String, required: true })
  text: string;

  @Prop({ type: SchemaTypes.Date, default: Date.now() })
  created_at: Date;
}

export const BooksSchema = SchemaFactory.createForClass(Book);
