import {
  Controller,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { IGetUploadService } from '../../types/service/get-upload-service.interface';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('User')
@Controller('user')
class UploadUserController {
  constructor(private readonly uploadService: IGetUploadService) {}

  @Post('/upload/:id')
  @ApiParam({ name: 'id', description: 'User id' })
  @UseInterceptors(FileInterceptor('file'))
  async execute(
    @Param('id') id: string,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Response> {
    await this.uploadService.upload(file, id);
    return res.status(HttpStatus.OK).json({ ok: 'ok' });
    // }
  }
}
export { UploadUserController };
