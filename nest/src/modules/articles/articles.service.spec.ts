import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Articles } from '../../entities/articles.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { NotFoundException } from '@nestjs/common';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let repository: Repository<Articles>;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(Articles),
          useClass: Repository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    repository = module.get<Repository<Articles>>(getRepositoryToken(Articles));
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getById', () => {
    it('should return article from cache if exists', async () => {
      const articleId = 1;
      const cachedArticle = {
        id: articleId,
        title: 'Test Article',
        text: 'asdadsa',
        // Add other properties as needed
      };
      jest.spyOn(cacheManager, 'get').mockResolvedValue(cachedArticle);

      const result = await service.getById(articleId);

      expect(result).toEqual(cachedArticle);
      expect(cacheManager.get).toHaveBeenCalledWith(articleId.toString());
    });

    it('should return article from repository if not in cache', async () => {
      const articleId = 1;
      const article = {
        id: articleId,
        title: 'Test Article',
        text: 'Test Article',
        author_id: 1,
        image_path: 'test.jpg',
        created_at: new Date(),
        updated_at: new Date(),
        is_publicated: true,
        author: null,
        // Add other properties as needed
      };
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(article);

      const result = await service.getById(articleId);

      expect(result).toEqual(article);
      expect(cacheManager.get).toHaveBeenCalledWith(articleId.toString());
      expect(cacheManager.set).toHaveBeenCalledWith(
        articleId.toString(),
        article,
      );
    });

    it('should throw NotFoundException if article not found', async () => {
      const articleId = 999; // Assuming this ID doesn't exist
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.getById(articleId)).rejects.toThrow(
        new NotFoundException('Article not found'),
      );
    });
  });

  // Add tests for other methods: create, update, delete
});
