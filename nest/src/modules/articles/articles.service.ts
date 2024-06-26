import { Articles } from '../../entities/articles.entity';
import {
  ArticlesCreateDto,
  ArticlesFilterDto,
  ArticlesFullDto,
  ArticlesListDto,
  ArticlesUpdateDto,
} from './schemas/articles.dto';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
//import { Users } from '../../entities/users.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RmqClientService } from 'src/providers/rmq_client/rmq.service';
import { RmqPatterns } from 'src/common/rmq_patterns';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Articles)
    private readonly articlesRepository: Repository<Articles>,
    // disabled for global filter QueryFailed
    // @InjectRepository(Users)
    // private readonly usersRepository: Repository<Users>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly rmqClientService: RmqClientService,
  ) {}

  async create(data: ArticlesCreateDto): Promise<ArticlesFullDto> {
    // disabled for global filter QueryFailed
    // const user = await this.usersRepository.findOneBy({ id: data.author_id });
    // if (!user) {
    //   throw new BadRequestException('Author_id is not found');
    // }
    const article = await this.articlesRepository.save(data);
    await this.cacheManager.set(article.id.toString(), article); // обновляем кеш
    const sended = this.rmqClientService.send(
      RmqPatterns.article_created,
      article,
    );
    return { sended, ...article };
  }

  async list(filter: ArticlesFilterDto): Promise<ArticlesListDto> {
    const { take, skip, order, title, text, ...where } = filter;
    let orderObject;
    if (order) {
      orderObject = { [order.split(' ')[0]]: order.split(' ')[1] };
    }

    // поиск текста по подстроке
    let titleSearch;
    if (title) {
      titleSearch = ILike(`%${title}%`);
    }
    // поиск текста по подстроке
    let textSearch;
    if (text) {
      textSearch = ILike(`%${text}%`);
    }

    const [articles, count] = await this.articlesRepository.findAndCount({
      // выбираем все поля кроме Text, из-за его возможно большого размера
      select: [
        'id',
        'title',
        'author_id',
        'created_at',
        'image_path',
        'updated_at',
      ],
      where: { title: titleSearch, text: textSearch, ...where },
      take,
      skip,
      order: orderObject,
    });

    this.rmqClientService.send(RmqPatterns.article_listed, {
      data: articles,
      count,
    });

    return {
      data: articles,
      count: count,
    };
  }

  async getById(id: number): Promise<ArticlesFullDto> {
    // сначала читаем кеш
    if (await this.cacheManager.get(id.toString())) {
      return await this.cacheManager.get(id.toString());
    }
    const article = await this.articlesRepository.findOneBy({ id });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    await this.cacheManager.set(id.toString(), article); // обновляем кеш
    return article;
  }

  async update(id: number, body: ArticlesUpdateDto): Promise<ArticlesFullDto> {
    if (Object.keys(body).length === 0) {
      throw new HttpException('no fields to update', HttpStatus.BAD_REQUEST);
    }
    const article = await this.articlesRepository.findOneBy({ id: id });
    if (!article) {
      throw new HttpException('not found article', HttpStatus.BAD_REQUEST);
    }
    const updatedArticle = this.articlesRepository.merge(article, body);
    await this.cacheManager.set(id.toString(), updatedArticle); // обновляем кеш
    return updatedArticle;
  }

  async delete(id: number): Promise<ArticlesFullDto> {
    const article = await this.articlesRepository.findOneBy({ id: id });
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
    this.rmqClientService.send(RmqPatterns.article_deleted, article);
    await this.cacheManager.del(id.toString()); // удаляем кеш
    return article;
  }
}
