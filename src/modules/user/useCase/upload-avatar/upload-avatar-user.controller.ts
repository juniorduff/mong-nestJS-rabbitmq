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
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('User')
@Controller('user')
class UploadUserController {
  constructor(private readonly uploadService: IGetUploadService) {}

  @Post('/upload/:id')
  @ApiParam({ name: 'id', description: 'User id' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const directory = 'uploads/';
          if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
          }
          cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
          const extension = path.extname(file.originalname);
          cb(null, `${req.params.id}-${Date.now()}${extension}`);
        },
      }),
    }),
  )
  async execute(
    @Param('id') id: string,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Response> {
    await this.uploadService.upload(file.path, id);
    return res.status(HttpStatus.OK).json({ ok: 'ok' });
    // }
  }
}
export { UploadUserController };
