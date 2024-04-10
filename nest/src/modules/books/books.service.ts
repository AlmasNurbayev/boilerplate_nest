import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, SortOrder } from 'mongoose';
import { Book } from '../../entities/books.mongo';
import {
  BooksCreateDto,
  BooksFilterDto,
  BooksUpdateDto,
} from './schemas/books.dto';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

  create(data: BooksCreateDto) {
    const book = new this.bookModel(data);
    return book.save();
  }

  async getById(id: string) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) throw new BadRequestException('id not valid');

    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new BadRequestException('Book not found');
    }
    return book;
  }

  async list(query: BooksFilterDto) {
    // фильтрация - перекладываем query в форматы MongoDB
    const where: any = {};
    const { take, skip, order } = query;
    if (query.searchText) {
      // поиск по подстрокев полях, где есть текстовой индекс
      where.$text = { $search: query.searchText, $caseSensitive: false };
    }
    let sort:
      | string
      | { [key: string]: SortOrder | { $meta: any } }
      | [string, SortOrder][] = {};

    if (order) {
      sort = { [order.split(' ')[0]]: order.split(' ')[1] === 'ASC' ? 1 : -1 };
    }
    const books = await this.bookModel
      .find(where)
      .skip(skip)
      .limit(take)
      .sort(sort)
      .populate('comments');
    const count = await this.bookModel.countDocuments(where);
    return {
      data: books,
      count: count,
    };
  }

  async delete(id: string) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) throw new BadRequestException('id not valid');

    const book = await this.bookModel.findByIdAndDelete(id);
    if (!book) {
      throw new BadRequestException('Book not found');
    }
    return book;
  }

  async update(id: string, data: BooksUpdateDto) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) throw new BadRequestException('id not valid');

    const book = await this.bookModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!book) {
      throw new BadRequestException('Book not found');
    }
    return book;
  }
}
