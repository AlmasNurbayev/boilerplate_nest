import { BadRequestException, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

export class IdMongoPipe implements PipeTransform {
  transform(value: string) {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Id is invalid');
    }
    return value;
  }
}
