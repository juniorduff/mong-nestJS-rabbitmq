import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUserRepository } from '../../types/repository/create-user.interface';
import { User } from '@prisma/client';
import { IGetAvatarUserService } from '../../types/service/get-avatar-user-service.interface';
import { promisify } from 'util';
import * as fs from 'fs';

const readFileAsync = promisify(fs.readFile);

@Injectable()
class GetAvatarUserService implements IGetAvatarUserService {
  constructor(private userRepository: IUserRepository) {}

  async findByAvatar(avatar: string): Promise<User> {
    const user = await this.userRepository.findByAvatar(avatar).catch((err) => {
      throw new BadRequestException({ message: err.message });
    });
    if (!user) {
      throw new NotFoundException('Avatar not found');
    }
    return { ...user, avatar: await this.readFileToBase64(user.avatar) };
  }

  private async readFileToBase64(filePath: string): Promise<string> {
    const fileData = await readFileAsync(filePath);
    return Buffer.from(fileData).toString('base64');
  }
}

export { GetAvatarUserService };
