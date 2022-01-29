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
import { TopSponsorService } from './topsponsor.service';
import { CreateTopSponsorDto } from './dtos/create-topsponsor.dto';

@Controller('api/top_sponsor')
@ApiTags('Top Sponsor')
export class TopSponsorController {
    constructor(
        private readonly topSponsorService: TopSponsorService,
        private readonly uploadService: UploadService,
        private readonly settingService: SettingService,
        private readonly userService: UserService,
    ) {}

    @UseInterceptors(FileInterceptor('image'))
    @Post('')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async create_top_sponsor(
        @Body() body: CreateTopSponsorDto,
        @UploadedFile() file: Express.Multer.File,
        @Request() req
    ) {

        const dateAvailable = await this.topSponsorService.checkDate(body);
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
        
        const topSponsor = await this.topSponsorService.createTopSponsor({
            image: path,
            ...body,
            creator: req.user.id
        });

        const price = await this.settingService.getPrice('top_sponsor');

        const user = await this.userService.findUserById(req.user.id);
        const new_credits = user.credits - price;
        user.credits = new_credits;
        await this.userService.updateUser(user);
        

        return {success: true, top_sponsor: topSponsor, credits: new_credits}
    }

    @Get('user_top_sponsor')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async user_top_sponsor(
        @Query() query,
        @Request() req
    ) {
        const user_id = req.user.id;
        const result = await this.topSponsorService.getUserTopSponsor({...query, user_id: user_id});
        console.log(result);

        return {success: true, data: result};
    }

    @Get('get_top_sponsors')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async get_top_sponsors(
        @Query() query,
        @Request() req
    ) {
        const result = await this.topSponsorService.getTopSponsors(query);
        return {success: true, data: result};
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async delete_top_sponsor(
        @Param('id') id: string
    ) {
        console.log(id);
        await this.topSponsorService.deleteTopSponsor(id);
        return { success: true }
    }

    @Get('get_disabled_dates')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async get_disabled_dates() {
        console.log('check disable dates');
        const results = await this.topSponsorService.getDisabledDates();
        return {success: true, data: results};
    }

}