import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../types/repository/create-user.interface';
import { IDeleteUserService } from '../../types/service/delete-user-service.interface';

@Injectable()
class DeleteUserService implements IDeleteUserService {
  constructor(private userRepository: IUserRepository) {}
  async delete(user_id: string): Promise<void> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new NotFoundException('User not exists');
    }
    return this.userRepository.deleteById(user_id);
  }
}

export { DeleteUserService };
