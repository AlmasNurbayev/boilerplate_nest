import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Articles } from '../../entities/articles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../entities/users.entity';
import { RmqClientModule } from 'src/providers/rmq_client/rmq.module';

@Module({
  imports: [TypeOrmModule.forFeature([Articles, Users]), RmqClientModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [],
})
export class ArticlesModule {}
