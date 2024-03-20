import { Articles } from 'src/entities/articles.entity';
import {
  ArticlesCreateDto,
  ArticlesFilterDto,
  ArticlesFullDto,
  ArticlesListDto,
} from './shemas/articles.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Articles)
    private readonly articlesRepository: Repository<Articles>,
  ) {}

  async create(data: ArticlesCreateDto): Promise<ArticlesFullDto> {
    const article = await this.articlesRepository.save(data);
    return article;
  }

  async list(filter: ArticlesFilterDto): Promise<ArticlesListDto> {
    const { take, skip, order, ...where } = filter;
    let orderObject;
    if (order) {
      orderObject = { [order.split(' ')[0]]: order.split(' ')[1] };
    }
    const [publications, count] = await this.articlesRepository.findAndCount({
      where: { ...where },
      take,
      skip,
      order: orderObject,
    });

    return {
      data: publications,
      total_count: count,
    };
  }

  async getById(id: number): Promise<ArticlesFullDto> {
    const article = await this.articlesRepository.findOneBy({ id });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }
}
