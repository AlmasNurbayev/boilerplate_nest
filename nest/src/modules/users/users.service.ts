import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { UserWithoutPasswordDto } from './schemas/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async getById(id: number): Promise<UserWithoutPasswordDto> {
    const user = await this.usersRepository.findOne({
      select: ['id', 'email', 'is_confirmed', 'created_at'],
      where: { id },
    });
    user.password = undefined;
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  list() {
    return this.usersRepository.find({
      select: ['id', 'email', 'is_confirmed', 'created_at'],
    });
  }
}
