import { Articles } from 'src/entities/articles.entity';
import {
  ArticlesCreateDto,
  ArticlesFilterDto,
  ArticlesFullDto,
  ArticlesListDto,
  ArticlesUpdateDto,
} from './schemas/articles.dto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Articles)
    private readonly articlesRepository: Repository<Articles>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async create(data: ArticlesCreateDto): Promise<ArticlesFullDto> {
    const user = await this.usersRepository.findOneBy({ id: data.author_id });
    if (!user) {
      throw new BadRequestException('Author_id is not found');
    }
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
      count: count,
    };
  }

  async getById(id: number): Promise<ArticlesFullDto> {
    const article = await this.articlesRepository.findOneBy({ id });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async update(id: number, body: ArticlesUpdateDto): Promise<ArticlesFullDto> {
    if (Object.keys(body).length === 0) {
      throw new HttpException('no fields to update', HttpStatus.BAD_REQUEST);
    }
    const article = await this.articlesRepository.findOneBy({ id: id }); //находим запись
    if (!article) {
      throw new HttpException('not found article', HttpStatus.BAD_REQUEST);
    }
    const res = await this.articlesRepository.merge(article, body);
    return res;
  }

  async delete(id: number): Promise<ArticlesFullDto> {
    const article = await this.articlesRepository.findOneBy({ id: id }); //находим запись
    if (!article) {
      throw new HttpException('not found article', HttpStatus.BAD_REQUEST);
    }
    const res = await this.articlesRepository.delete({ id: id });
    if (res.affected === 0) {
      throw new HttpException(
        'not delete article',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return article;
  }
}
