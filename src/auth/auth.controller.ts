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
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/login.dto';
import { TokenResponseDto } from './dtos/token-response.dto';
import { UserDto } from '../user/dtos/user.dto';
import { EmailService } from '../kit/email/email.service';
import * as randomstring from 'randomstring';
import { UploadService } from 'src/common/upload/upload.service';
@Controller('api/auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly uploadService: UploadService
  ) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  async getProfile(@Request() req): Promise<UserDto> {
    const wallet_address = req.user.wallet_address;
    const user = await this.userService.findUserByWalletAddress(wallet_address);
    if (!user) {
      throw new UnauthorizedException(
        `Invalid user authorization token found.`,
      );
    }
    return user.toUserDto();
  }

  @Post('login')
  @ApiOkResponse({ type: TokenResponseDto })
  async login(@Body() body: LoginDto): Promise<any> {
    const user = await this.authService.validateUser(body.wallet_address, body.signature);
    if (!user) {
      throw new BadRequestException(); // return 400 error for bad request
      return 
    } 

    const token = this.authService.login(user);
    const currentUser = await this.userService.findUserByWalletAddress(user.wallet_address);
    const result = new TokenResponseDto(token, currentUser.toUserDto());
    return {success: true, data: result};
  }
}
