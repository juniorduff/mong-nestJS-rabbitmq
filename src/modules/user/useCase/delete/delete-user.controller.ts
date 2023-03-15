import { Controller, Delete, HttpStatus, Param, Res } from '@nestjs/common';
import { IDeleteUserService } from '../../types/service/delete-user-service.interface';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('User')
@Controller('user')
class DeleteUserController {
  constructor(private deleteUserService: IDeleteUserService) {}
  @Delete(':user_id')
  async execute(@Res() response: Response, @Param('user_id') user_id: string) {
    await this.deleteUserService.delete(user_id);
    return response.status(HttpStatus.NO_CONTENT).send();
  }
}
export { DeleteUserController };
