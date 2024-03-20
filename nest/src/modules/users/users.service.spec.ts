import { Test, TestingModule } from '@nestjs/testing';
import { Users } from '../../entities/users.entity';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<Users>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  it('should return a user without password', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      is_confirmed: true,
      created_at: new Date(),
      //password: 'hashed_password', // We will expect this to be removed
    };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as Users);

    const result = await service.getById(1);

    expect(result.id).toEqual(mockUser.id);
    expect(result.email).toEqual(mockUser.email);
    expect(result.is_confirmed).toEqual(mockUser.is_confirmed);
    expect(result.created_at).toEqual(mockUser.created_at);
  });

  it('should throw NotFoundException if user is not found', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    await expect(service.getById(9999)).rejects.toThrow(NotFoundException);
  });

  it('should return a list of users with selected fields and count', async () => {
    const mockUsers = [
      {
        id: 1,
        email: 'test1@example.com',
        is_confirmed: true,
        created_at: new Date(),
        password: 'hashed_password',
      },
      {
        id: 2,
        email: 'test2@example.com',
        is_confirmed: false,
        created_at: new Date(),
        password: 'hashed_password',
      },
    ];

    const mockCount = mockUsers.length;

    jest
      .spyOn(userRepository, 'findAndCount')
      .mockResolvedValue([mockUsers, mockCount]);

    const result = await service.list();

    expect(result.data).toEqual(mockUsers);
    expect(result.count).toEqual(mockCount);
  });

  it('should return an empty array and count 0 if no users are found', async () => {
    jest.spyOn(userRepository, 'findAndCount').mockResolvedValue([[], 0]);

    const result = await service.list();

    expect(result.data).toEqual([]);
    expect(result.count).toEqual(0);
  });
});
