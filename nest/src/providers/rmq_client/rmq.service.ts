import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class RmqClientService {
  constructor(@Inject('rmq_client') private readonly client: ClientProxy) {}
  public send(pattern: string, data: any): boolean {
    try {
      this.client.emit(pattern, data);
      return true;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }
}
