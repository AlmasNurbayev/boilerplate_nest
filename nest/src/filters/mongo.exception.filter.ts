import {
  ExceptionFilter,
  Catch,
  HttpStatus,
  ArgumentsHost,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import * as mongoose from 'mongoose';

@Catch(mongoose.mongo.MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    if (exception.code === 11000) {
      console.log('MongoError: ', exception.message);
      response.status(HttpStatus.CONFLICT).json({
        message: 'Duplicate key error',
        object: Object.keys(exception.keyValue),
      });
    }
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error.',
    });
  }
}
