import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class RmqController {
  constructor() {} //private readonly rmqClientService: RmqClientService, //@Inject()

  @MessagePattern('notes:processed')
  async notifications(@Payload() data: string, @Ctx() context: RmqContext) {
    const content = await context.getMessage().content.toString();
    const pattern = context.getPattern();
    console.log('data', JSON.parse(content).data);
    console.log('pattern', pattern);
  }
}
