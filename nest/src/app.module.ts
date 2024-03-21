import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './modules/articles/articles.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import database from './config/database';
import app from './config/app';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      // cache: true,
      load: [app, database],
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
        isGlobal: true,
        store: redisStore,
        ttl: configService.get<number>('cache.ttl'),
        host: configService.get<string>('cache.host'),
        port: configService.get<number>('cache.port'),
        password: configService.get<number>('cache.password'),
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    ArticlesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
