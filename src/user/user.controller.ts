import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Put,
    Request,
    UnauthorizedException,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/dtos/user.dto';
import { EmailService } from '../kit/email/email.service';
import * as randomstring from 'randomstring';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/common/upload/upload.service';
import { compare, hash } from 'bcrypt';

@Controller('api/user')
@ApiTags('User')
export class UserController {
  constructor(
      private readonly userService: UserService,
      private readonly emailService: EmailService,
      private readonly uploadService: UploadService
  ) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  async all() {
    const users = await this.userService.getAllUsers();
    return {success: true, data: users};
  }
}
