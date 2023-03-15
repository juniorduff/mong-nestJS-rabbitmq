import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IGetUserService } from '../../types/service/get-user-service.interface';

@ApiTags('User')
@Controller('user')
class GetUserController {
  constructor(private readonly getUserService: IGetUserService) {}
  @Get(':user_id')
  find(@Param('user_id') user_id: string) {
    return this.getUserService.findById(user_id);
  }
}
export { GetUserController };
