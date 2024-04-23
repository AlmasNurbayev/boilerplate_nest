import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { RmqClientService } from './rmq.service';
import { RmqController } from './rmq.controller';
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'rmq_client',
        imports: [ConfigModule],
        useFactory: (configService) => configService.get('rmq_client'),
        inject: [ConfigService],
      },
      {
        name: 'rmq_service',
        imports: [ConfigModule],
        useFactory: (configService) => configService.get('rmq_service'),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [RmqController],
  providers: [RmqClientService],
  exports: [RmqClientService],
})
export class RmqClientModule {}
