import { Module } from '@nestjs/common';
import { DeleteUserController } from './useCase/delete/delete-user.controller';
import { GetUserController } from './useCase/get-user/get-user.controller';
import { GetAvatarController } from './useCase/get-avatar/get-avatar.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ICreateUserService } from './types/service/create-user-service.interface';
import { CreateUserService } from './useCase/create/create-user.service';
import { CreateUserController } from './useCase/create/create-user.controller';
import { IUserRepository } from './types/repository/create-user.interface';
import { UserRepository } from './repository/user.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { IGetUserService } from './types/service/get-user-service.interface';
import { GetUserService } from './useCase/get-user/get-user.service';
import { IGetUploadService } from './types/service/get-upload-service.interface';
import { GetUploadService } from './useCase/upload-avatar/upload-avatar-user.service';
import { UploadUserController } from './useCase/upload-avatar/upload-avatar-user.controller';
import { IDeleteUserService } from './types/service/delete-user-service.interface';
import { DeleteUserService } from './useCase/delete/delete-user.service';
import { IGetAvatarUserService } from './types/service/get-avatar-user-service.interface';
import { GetAvatarUserService } from './useCase/get-avatar/get-avatar-user.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:15672'],
          queue: 'user_created',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [
    CreateUserController,
    DeleteUserController,
    GetUserController,
    GetAvatarController,
    UploadUserController,
  ],
  providers: [
    PrismaService,
    { provide: ICreateUserService, useClass: CreateUserService },
    { provide: IUserRepository, useClass: UserRepository },
    { provide: IGetUserService, useClass: GetUserService },
    { provide: IGetUploadService, useClass: GetUploadService },
    { provide: IDeleteUserService, useClass: DeleteUserService },
    { provide: IGetAvatarUserService, useClass: GetAvatarUserService },
  ],
})
export class UserModule {}
