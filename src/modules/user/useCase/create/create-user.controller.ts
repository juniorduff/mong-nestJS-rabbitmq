import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { ICreateUserService } from '../../types/service/create-user-service.interface';
import { UserDto } from '../../dto/user.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Producer } from '../../../rabbitmq/producer';
import { sendEmail } from '../../../email/email';

@ApiTags('User')
@Controller('user')
class CreateUserController {
  constructor(
    private readonly createUserService: ICreateUserService,
    @Inject('USER_SERVICE') private client: ClientProxy,
  ) {}

  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  async execute(
    @Res() res: Response,
    @Body() body: UserDto,
    @UploadedFile('file') file: Express.Multer.File,
  ): Promise<Response> {
    console.log('body', body);
    const user = await this.createUserService.create(body);
    await Producer.sendToRabbitMQ('user_created', 'user successfully created');
    await sendEmail(body.email, 'User Created', 'User Created Successfully');

    return res.status(HttpStatus.CREATED).json(user);
  }
}
export { CreateUserController };
