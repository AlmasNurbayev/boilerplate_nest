import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { BadRequestException } from '@nestjs/common';
import { Articles } from '../../entities/articles.entity';
import { Users } from '../../entities/users.entity';
import { ArticlesCreateDto } from './schemas/articles.dto';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let articlesRepository: Repository<Articles>;
  let usersRepository: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(Articles),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Users),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    articlesRepository = module.get<Repository<Articles>>(
      getRepositoryToken(Articles),
    );
    usersRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  it('should create an article if author exists', async () => {
    const authorId = 1;
    const mockArticleCreateDto: ArticlesCreateDto = {
      title: 'Test Article',
      text: 'This is a test article',
      author_id: authorId,
      image_path: 'https://example.com/image.jpg',
    };
    const mockUser: Users = {
      id: authorId,
      email: 'johndoe@example.com',
      password: 'password',
      is_confirmed: true,
      created_at: new Date(),
    };
    const mockSavedArticle: Articles = {
      id: 1,
      title: 'Test Article',
      text: 'This is a test article',
      is_publicated: true,
      created_at: new Date(),
      updated_at: new Date(),
      author_id: authorId,
      image_path: 'https://example.com/image.jpg',
      author: mockUser,
    };

    jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(mockUser);
    jest.spyOn(articlesRepository, 'save').mockResolvedValue(mockSavedArticle);

    const result = await service.create(mockArticleCreateDto);

    expect(result).toEqual(mockSavedArticle);
    expect(articlesRepository.save).toHaveBeenCalledWith(mockArticleCreateDto);
  });

  it('should throw BadRequestException if author does not exist', async () => {
    const authorId = 1;
    const mockArticleCreateDto: ArticlesCreateDto = {
      title: 'Test Article',
      text: 'This is a test article',
      author_id: authorId,
      image_path: 'https://example.com/image.jpg',
    };

    jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);

    await expect(service.create(mockArticleCreateDto)).rejects.toThrow(
      BadRequestException,
    );
  });
});
