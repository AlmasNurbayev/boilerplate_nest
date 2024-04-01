import { Comment } from 'src/entities/comments.mongo';
import {
  CommentsCreateDto,
  CommentsFilterDto,
  CommentsUpdateDto,
} from './schemas/comments.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, SortOrder } from 'mongoose';
import { Book } from 'src/entities/books.mongo';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Book.name) private bookModel: Model<Book>,
  ) {}

  async create(data: CommentsCreateDto) {
    const isValidId = mongoose.Types.ObjectId.isValid(data.book);
    if (!isValidId) throw new BadRequestException('book_id not valid');

    const book = await this.bookModel.findById(data.book);
    if (!book) {
      throw new BadRequestException('Book not found');
    }

    // сохраняем коммент в своей коллекции
    const comment = new this.commentModel(data);
    const savedComment = await comment.save();

    // в родительскую книгу добавляем ссылку на коммент
    book.comments.push(comment);
    await book.save();

    return savedComment;
  }

  async list(query: CommentsFilterDto) {
    const where: any = {};
    const { take, skip, order } = query;
    if (query.title) {
      // поиск по подстроке
      where.title = { $regex: query.title, $options: 'i' };
    }
    if (query.text) {
      // поиск по подстроке
      where.text = { $regex: query.text, $options: 'i' };
    }
    let sort:
      | string
      | { [key: string]: SortOrder | { $meta: any } }
      | [string, SortOrder][] = {};

    if (order) {
      sort = { [order.split(' ')[0]]: order.split(' ')[1] === 'ASC' ? 1 : -1 };
    }
    const comments = await this.commentModel
      .find(where)
      .skip(skip)
      .limit(take)
      .sort(sort)
      .populate('book');
    const count = await this.commentModel.countDocuments(where);
    return {
      data: comments,
      count: count,
    };
  }

  async getById(id: string) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) throw new BadRequestException('id not valid');

    const comment = await this.commentModel.findById(id);
    if (!comment) {
      throw new BadRequestException('Comment not found');
    }
    return comment;
  }

  async update(id: string, data: CommentsUpdateDto) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) throw new BadRequestException('id not valid');

    const comment = await this.commentModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!comment) {
      throw new BadRequestException('Comment not found');
    }
    return comment;
  }

  async delete(id: string) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) throw new BadRequestException('id not valid');

    const comment = await this.commentModel.findByIdAndDelete(id);
    if (!comment) {
      throw new BadRequestException('Comment not found');
    }
    return comment;
  }
}
