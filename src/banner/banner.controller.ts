import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import * as randomstring from 'randomstring';
import { CreateBannerDto } from './dtos/create-banner.dto';
import { BannerService } from './banner.service';
import { UploadService } from 'src/common/upload/upload.service';
import { SettingService } from 'src/setting/setting.service';
import { UserService } from 'src/user/user.service';

@Controller('api/banner')
@ApiTags('Banner')
export class BannerController {
    constructor(
        private readonly bannerService: BannerService,
        private readonly uploadService: UploadService,
        private readonly settingService: SettingService,
        private readonly userService: UserService,
    ) {}

    @UseInterceptors(FileInterceptor('image'))
    @Post('')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async create_banner(
        @Body() body: CreateBannerDto,
        @UploadedFile() file: Express.Multer.File,
        @Request() req
    ) {

        const dateAvailable = await this.bannerService.checkDate(body);
        if (!dateAvailable) {
            if (body.type == 'EXCLUSIVE') {
                return {success: false, message: 'Please choose another date or change type.'}
            } else {
                return {success: false, message: 'Please choose another date.'}
            }
        }

        // const fileName = randomstring.generate({
        //     length: 16,
        //     charset: 'alphabetic'
        // }) + '.jpg';

        // const path = 'assets/uploads/banner/' + fileName;
        // await this.uploadService.upload(path, file);

        const path = await this.uploadService.uploadToS3(file);

        const banner = await this.bannerService.createBanner({
            image: path,
            ...body,
            creator: req.user.id
        });

        const price_name = body.type == 'EXCLUSIVE' ? 'banner_exclusive' : 'banner_normal';
        const price = await this.settingService.getPrice(price_name);

        const user = await this.userService.findUserById(req.user.id);
        const new_credits = user.credits - price;
        user.credits = new_credits;
        await this.userService.updateUser(user);
        

        return {success: true, banner: banner, credits: new_credits}
    }

    @Get('user_banner')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async user_banner(
        @Query() query,
        @Request() req
    ) {
        const user_id = req.user.id;
        const result = await this.bannerService.getUserBanner({...query, user_id: user_id});
        console.log(result);

        return {success: true, data: result};
    }

    @Get('get_banners')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async get_banners(
        @Query() query,
        @Request() req
    ) {
        const result = await this.bannerService.getBanners(query);
        return {success: true, data: result};
    }

    @Get('get_disabled_dates')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async get_disabled_dates() {
        console.log('check disable dates');
        const results = await this.bannerService.getDisabledDates();
        return {success: true, data: results};
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async delete_banner(
        @Param('id') id: string
    ) {
        console.log(id);
        await this.bannerService.deleteBanner(id);
        return { success: true }
    }

}
