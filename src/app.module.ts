import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    UserModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:8080'],
          queue: 'user_created',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
