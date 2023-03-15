import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../types/repository/create-user.interface';
import { IGetUploadService } from '../../types/service/get-upload-service.interface';

@Injectable()
class GetUploadService implements IGetUploadService {
  constructor(private userRepository: IUserRepository) {}

  async upload(file: Express.Multer.File, user_id: string): Promise<any> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new NotFoundException('User not exists');
    }

    return this.userRepository.uploadAvatar(file, user_id);
  }
}

export { GetUploadService };
