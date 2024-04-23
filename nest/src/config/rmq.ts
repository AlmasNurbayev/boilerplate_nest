import { Transport } from '@nestjs/microservices';

export default () => {
  return {
    rmq_service: {
      name: 'rmq_service',
      transport: Transport.RMQ,
      persistent: true,
      noAck: false,
      options: {
        urls: [process.env.RMQ_URL || 'amqp://localhost:5674'],
        exchange: 'main',
        queue: 'from_back',
        queueOptions: {
          durable: true,
        },
      },
    },
    rmq_client: {
      name: 'rmq_client',
      transport: Transport.RMQ,
      persistent: true,
      noAck: false,
      options: {
        urls: [process.env.RMQ_URL || 'amqp://localhost:5674'],
        queue: 'from_nest',
        queueOptions: {
          durable: true,
        },
      },
    },
  };
};
