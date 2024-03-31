import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EntityNotFoundErrorFilter } from './filters/db.not_found.filter';
import { QueryFailedFilter } from './filters/db.query_failed.filter';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());

  app.useGlobalFilters(new EntityNotFoundErrorFilter());
  app.useGlobalFilters(new QueryFailedFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const options = new DocumentBuilder()
    .setTitle(configService.get('swagger.title'))
    .setDescription(configService.get('swagger.description'))
    .setVersion(configService.get('swagger.version'))
    .addBearerAuth(
      configService.get('swagger.bearer.options'),
      configService.get('swagger.bearer.slug'),
    )
    .addCookieAuth('refresh_qtim')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.enableCors(configService.get('cors'));

  await app.listen(parseInt(process.env.APP_PORT) || 3000);
}
bootstrap();
