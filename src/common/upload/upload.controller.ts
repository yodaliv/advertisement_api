import {
    Body,
    Controller,
    Post,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    Get,
    Param,
    Query,
    Res
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import path from 'path';

import { UploadService } from 'src/common/upload/upload.service';

@Controller('api/upload')
@ApiTags('Upload')
export class UploadController {
  constructor(
      private readonly uploadService: UploadService
  ) {}

  @Get('get_file')
  @ApiOkResponse({})
  async get_file(@Query() params, @Res() response) {
    try {
        const buffer = fs.readFileSync(
          `${__dirname}/../../../${params.path}`,
        );
        response.writeHead(200, { 'Content-Type': 'image/png' });
        response.end(buffer);
      } catch (e) {
        console.log(e);
        response.end()
      }
  }

  @Get('get_s3_file')
  @ApiOkResponse({})
  async get_s3_file(@Query() params, @Res() response) {
    try {
      const res = await this.uploadService.readS3File(params.path);
      response.writeHead(200, { 'Content-Type': 'image/png' });
      response.end(res.Body);
    } catch (e) {
      console.log(e);
      response.end()
    }
  }

  @Get('get_signedurl')
  @ApiOkResponse({})
  async get_signedurl(@Query() params, @Res() response) {
    try {
      const res = this.uploadService.getSignedUrl(params.path);
    } catch (e) {
      console.log(e);
      response.end()
    }
  }

}
