import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../entities/users.entity';
import { Repository } from 'typeorm';
import { UserListDto, UserWithoutPasswordDto } from './schemas/user.dto';

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
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async list(): Promise<UserListDto> {
    const [data, count] = await this.usersRepository.findAndCount({
      select: ['id', 'email', 'is_confirmed', 'created_at'],
    });
    return {
      data,
      count,
    };
  }
}
