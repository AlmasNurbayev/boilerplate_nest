import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { disconnect } from 'mongoose';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  afterAll(async () => {
    await disconnect();
    await app.close();
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/articles/999 (GET fail)', () => {
    return request(app.getHttpServer()).get('/articles/999').expect(404);
  });
  it('/articles/ (GET success)', async () => {
    return request(app.getHttpServer())
      .get('/articles/')
      .expect(200)
      .then(({ body }: request.Response) => {
        const data = body.data;
        expect(data).toBeDefined;
      });
  });
});
