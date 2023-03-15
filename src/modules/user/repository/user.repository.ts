import { PrismaService } from '../../../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { IUserRepository } from '../types/repository/create-user.interface';

@Injectable()
class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  uploadAvatar(file: string, user_id: string): Promise<any> {
    return this.prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        avatar: file,
      },
    });
  }
  async create(data: any): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
      },
    });
  }

  async findById(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }
  async deleteById(user_id: string): Promise<void> {
    const response = await this.prisma.user.delete({
      where: {
        id: user_id,
      },
    });
  }

  findByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  findByAvatar(avatar: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        avatar: avatar,
      },
    });
  }
}

export { UserRepository };
