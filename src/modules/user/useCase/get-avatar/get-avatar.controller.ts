import { Controller, Get, Param } from '@nestjs/common';
import { IGetAvatarUserService } from '../../types/service/get-avatar-user-service.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
class GetAvatarController {
  constructor(private avatarService: IGetAvatarUserService) {}

  @Get(':user_id/avatar')
  async getAvatar(@Param('user_id') user_id: string) {
    return this.avatarService.findByAvatar(user_id);
  }
}
export { GetAvatarController };
