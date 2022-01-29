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
import { SearchBarService } from './searchbar.service';
import { CreateSearchBarDto } from './dtos/create-searchbar.dto';

@Controller('api/search_bar')
@ApiTags('Search Bar')
export class SearchBarController {
    constructor(
        private readonly searchBarService: SearchBarService,
        private readonly uploadService: UploadService,
        private readonly settingService: SettingService,
        private readonly userService: UserService,
    ) {}

    @Post('')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async create_search_bar(
        @Body() body: CreateSearchBarDto,
        @UploadedFile() file: Express.Multer.File,
        @Request() req
    ) {

        const dateAvailable = await this.searchBarService.checkDate(body);
        if (!dateAvailable) {
            return {success: false, message: 'The date is busy. Please choose another date.'}
        }

        
        const SearchBar = await this.searchBarService.createSearchBar({
            ...body,
            creator: req.user.id
        });

        const price = await this.settingService.getPrice('search_bar');

        const user = await this.userService.findUserById(req.user.id);
        const new_credits = user.credits - price;
        user.credits = new_credits;
        await this.userService.updateUser(user);
        

        return {success: true, search_bar: SearchBar, credits: new_credits}
    }

    @Get('user_search_bar')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async user_search_bar(
        @Query() query,
        @Request() req
    ) {
        const user_id = req.user.id;
        const result = await this.searchBarService.getUserSearchBar({...query, user_id: user_id});
        console.log(result);

        return {success: true, data: result};
    }

    @Get('get_search_bars')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async get_search_bars(
        @Query() query,
        @Request() req
    ) {
        const result = await this.searchBarService.getSearchBars(query);
        return {success: true, data: result};
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async delete_search_bar(
        @Param('id') id: string
    ) {
        console.log(id);
        await this.searchBarService.deleteSearchBar(id);
        return { success: true }
    }

    @Get('get_disabled_dates')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async get_disabled_dates() {
        console.log('check disable dates');
        const results = await this.searchBarService.getDisabledDates();
        return {success: true, data: results};
    }

}