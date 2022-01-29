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
import { TopButtonService } from './topbutton.service';
import { CreateTopButtonDto } from './dtos/create-topbutton.dto';

@Controller('api/top_button')
@ApiTags('Top Button')
export class TopButtonController {
    constructor(
        private readonly topButtonService: TopButtonService,
        private readonly uploadService: UploadService,
        private readonly settingService: SettingService,
        private readonly userService: UserService,
    ) {}

    @Post('')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async create_top_button(
        @Body() body: CreateTopButtonDto,
        @UploadedFile() file: Express.Multer.File,
        @Request() req
    ) {

        const dateAvailable = await this.topButtonService.checkDate(body);
        if (!dateAvailable) {
            return {success: false, message: 'The date is busy. Please choose another date.'}
        }

        
        const topButton = await this.topButtonService.createTopButton({
            ...body,
            creator: req.user.id
        });

        const price = await this.settingService.getPrice('top_button');

        const user = await this.userService.findUserById(req.user.id);
        const new_credits = user.credits - price;
        user.credits = new_credits;
        await this.userService.updateUser(user);
        

        return {success: true, top_button: topButton, credits: new_credits}
    }

    @Get('user_top_button')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async user_top_button(
        @Query() query,
        @Request() req
    ) {
        const user_id = req.user.id;
        const result = await this.topButtonService.getUserTopButton({...query, user_id: user_id});
        console.log(result);

        return {success: true, data: result};
    }

    @Get('get_top_buttons')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async get_top_buttons(
        @Query() query,
        @Request() req
    ) {
        const result = await this.topButtonService.getTopButtons(query);
        return {success: true, data: result};
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async delete_top_button(
        @Param('id') id: string
    ) {
        console.log(id);
        await this.topButtonService.deleteTopButton(id);
        return { success: true }
    }

    @Get('get_disabled_dates')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async get_disabled_dates() {
        console.log('check disable dates');
        const results = await this.topButtonService.getDisabledDates();
        return {success: true, data: results};
    }

}