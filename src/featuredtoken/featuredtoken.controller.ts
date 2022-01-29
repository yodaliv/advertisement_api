import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Request,
    UnauthorizedException,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import * as randomstring from 'randomstring';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/common/upload/upload.service';
import { SettingService } from 'src/setting/setting.service';
import { UserService } from 'src/user/user.service';
import { FeaturedTokenService } from './featuredtoken.service';
import { CreateFeaturedTokenDto } from './dtos/create-featuredtoken.dto';

@Controller('api/featured_token')
@ApiTags('Featured Token')
export class FeaturedTokenController {
    constructor(
        private readonly featuredTokenService: FeaturedTokenService,
        private readonly uploadService: UploadService,
        private readonly settingService: SettingService,
        private readonly userService: UserService,
    ) {}

    @UseInterceptors(FileInterceptor('image'))
    @Post('')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async create_featured_token(
        @Body() body: CreateFeaturedTokenDto,
        @UploadedFile() file: Express.Multer.File,
        @Request() req
    ) {

        const dateAvailable = await this.featuredTokenService.checkDate(body);
        if (!dateAvailable) {
            return {success: false, message: 'The date is busy. Please choose another date.'}
        }

        // const fileName = randomstring.generate({
        //     length: 16,
        //     charset: 'alphabetic'
        // }) + '.jpg';

        // const path = 'assets/uploads/other/' + fileName;
        // await this.uploadService.upload(path, file);

        const path = await this.uploadService.uploadToS3(file);
        
        const featuredToken = await this.featuredTokenService.createFeaturedToken({
            image: path,
            ...body,
            creator: req.user.id
        });

        const price = await this.settingService.getPrice('featured_token');

        const user = await this.userService.findUserById(req.user.id);
        const new_credits = user.credits - price;
        user.credits = new_credits;
        await this.userService.updateUser(user);
        

        return {success: true, featured_token: featuredToken, credits: new_credits}
    }

    @Get('user_featured_token')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async user_featured_token(
        @Query() query,
        @Request() req
    ) {
        const user_id = req.user.id;
        const result = await this.featuredTokenService.getUserFeaturedToken({...query, user_id: user_id});
        console.log(result);

        return {success: true, data: result};
    }

    @Get('get_featured_tokens')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async get_featured_tokens(
        @Query() query,
        @Request() req
    ) {
        const result = await this.featuredTokenService.getFeaturedTokens(query);
        return {success: true, data: result};
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async delete_featured_token(
        @Param('id') id: string
    ) {
        console.log(id);
        await this.featuredTokenService.deleteFeaturedToken(id);
        return { success: true }
    }

    @Get('get_disabled_dates')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async get_disabled_dates() {
        console.log('check disable dates');
        const results = await this.featuredTokenService.getDisabledDates();
        return {success: true, data: results};
    }

}