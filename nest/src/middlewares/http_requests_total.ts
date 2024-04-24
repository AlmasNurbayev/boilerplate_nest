import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { NextFunction } from 'express';
import { Counter } from 'prom-client';
import { Response, Request } from 'express';

@Injectable()
export class HttpRequestTotalMiddleware implements NestMiddleware {
  constructor(
    @InjectMetric('http_requests_total') public counter: Counter<string>,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      this.counter.inc({
        method: req.method,
        route: req.path,
        originalUrl: req.originalUrl,
        statusCode: res.statusCode,
      });
    });
    next();
  }
}
