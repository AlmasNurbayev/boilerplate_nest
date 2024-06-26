import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({ status: 200, type: String, description: 'Hello World!' })
  getHello(): string {
    return this.appService.getHello();
  }
}
