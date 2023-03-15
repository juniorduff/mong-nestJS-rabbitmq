import { ICreateUserService } from '../../types/service/create-user-service.interface';
import { ConflictException, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../types/repository/create-user.interface';
import { User } from '@prisma/client';
import { UserDto } from '../../dto/user.dto';

@Injectable()
class CreateUserService implements ICreateUserService {
  constructor(private userRepository: IUserRepository) {}
  async create(data: UserDto): Promise<User> {
    const user = await this.userRepository.findByEmail(data.email);

    if (user) {
      throw new ConflictException('User already exists');
    }
    return this.userRepository.create(data);
  }
}

export { CreateUserService };
