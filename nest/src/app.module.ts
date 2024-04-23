import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './modules/articles/articles.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksModule } from './modules/books/books.module';
import { CommentsModule } from './modules/comments/comments.module';
import { app, database, mailer, rmq, sms } from './config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      // cache: true,
      load: [app, database, mailer, sms, rmq],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService) => configService.get('database'),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        name: 'cache',
        isGlobal: true,
        store: redisStore,
        ttl: configService.get<number>('cache.ttl'),
        host: configService.get<string>('cache.host'),
        port: configService.get<number>('cache.port'),
        db: configService.get<number>('cache.db'),
        password: configService.get<number>('cache.password'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('mongo'),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService) => configService.get('mailer'),
      inject: [ConfigService],
    }),
    AuthModule,
    ArticlesModule,
    UsersModule,
    BooksModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
