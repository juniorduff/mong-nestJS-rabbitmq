import { ICreateUserService } from '../../types/service/create-user-service.interface';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUserRepository } from '../../types/repository/create-user.interface';
import { User } from '@prisma/client';
import { UserDto } from '../../dto/user.dto';
import { IGetUserService } from '../../types/service/get-user-service.interface';
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
