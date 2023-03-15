import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUserRepository } from '../../types/repository/create-user.interface';
import { User } from '@prisma/client';
import { IGetUserService } from '../../types/service/get-user-service.interface';
import { promisify } from 'util';
import * as fs from 'fs';

const readFileAsync = promisify(fs.readFile);

@Injectable()
class GetUserService implements IGetUserService {
  constructor(private userRepository: IUserRepository) {}

  async findById(user_id: string): Promise<User> {
    const user = await this.userRepository.findById(user_id).catch((err) => {
      throw new BadRequestException({ message: err.message });
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}

export { GetUserService };
