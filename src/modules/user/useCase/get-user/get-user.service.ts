import { ICreateUserService } from '../../types/service/create-user-service.interface';
import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../types/repository/create-user.interface';
import { User } from '@prisma/client';
import { UserDto } from '../../dto/user.dto';
@Injectable()
class CreateUserService implements ICreateUserService {
  constructor(private userRepository: IUserRepository) {}
  create(data: UserDto): Promise<User> {
    console.log(data);
    return this.userRepository.create(data);
  }
}

export { CreateUserService };
